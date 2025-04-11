import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { interviewId, status } = body;

    // Validate the request
    if (!interviewId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the interview to verify ownership
    const interviewRef = db.collection("interviews").doc(interviewId);
    const interview = await interviewRef.get();

    if (!interview.exists) {
      return NextResponse.json(
        { success: false, message: "Interview not found" },
        { status: 404 }
      );
    }

    const interviewData = interview.data();
    
    // Verify the user owns this interview
    if (interviewData?.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update the interview status
    await interviewRef.update({
      status,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating interview status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 