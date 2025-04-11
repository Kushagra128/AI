import { NextResponse } from "next/server";
import { signOut } from "@/lib/actions/auth.action";

export async function POST() {
  try {
    // Sign out the user
    await signOut();

    // Return success response
    return NextResponse.json(
      { success: true, message: "Successfully logged out" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);

    // Return error response
    return NextResponse.json(
      { success: false, message: "Failed to log out" },
      { status: 500 }
    );
  }
} 