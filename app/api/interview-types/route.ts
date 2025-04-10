import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET() {
  try {
    const interviewTypes = await db.collection("interviewTypes").get();
    return NextResponse.json({
      success: true,
      data: interviewTypes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    });
  } catch (error) {
    console.error("Error fetching interview types:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch interview types" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const docRef = await db.collection("interviewTypes").add({
      ...data,
      createdAt: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...data }
    });
  } catch (error) {
    console.error("Error creating interview type:", error);
    return NextResponse.json({ success: false, error: "Failed to create interview type" }, { status: 500 });
  }
} 