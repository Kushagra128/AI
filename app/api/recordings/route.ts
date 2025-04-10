import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const docRef = await db.collection("recordings").add({
      ...data,
      userId: user.id,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...data }
    });
  } catch (error) {
    console.error("Error saving recording:", error);
    return NextResponse.json({ success: false, error: "Failed to save recording" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get("interviewId");

    let query = db.collection("recordings").where("userId", "==", user.id);
    if (interviewId) {
      query = query.where("interviewId", "==", interviewId);
    }

    const recordings = await query.orderBy("createdAt", "desc").get();
    
    return NextResponse.json({
      success: true,
      data: recordings.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    });
  } catch (error) {
    console.error("Error fetching recordings:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch recordings" }, { status: 500 });
  }
} 