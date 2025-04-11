import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the feedback ID from the URL
    const feedbackId = params.id;
    if (!feedbackId) {
      return NextResponse.json(
        { success: false, message: "Missing feedback ID" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Get the feedback to verify ownership
    const feedbackRef = db.collection("feedback").doc(feedbackId);
    const feedback = await feedbackRef.get();

    if (!feedback.exists) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" },
        { status: 404 }
      );
    }

    const feedbackData = feedback.data();
    
    // Verify the user owns this feedback
    if (feedbackData?.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update the feedback with the provided data
    await feedbackRef.update({
      ...body,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 