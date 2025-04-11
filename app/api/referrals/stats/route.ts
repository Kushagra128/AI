import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get user's referral code
    const userDoc = await db.collection("users").doc(user.id).get();
    const userData = userDoc.data();

    // Get all referrals for the user
    const referrals = await db
      .collection("referrals")
      .where("referrerId", "==", user.id)
      .get();

    // Calculate statistics
    const totalReferrals = referrals.size;
    const activeReferrals = referrals.docs.filter(
      doc => doc.data().status === "active"
    ).length;

    // Calculate rewards (example: $10 per active referral)
    const rewardsEarned = activeReferrals * 10;

    return NextResponse.json({
      success: true,
      data: {
        totalReferrals,
        activeReferrals,
        rewardsEarned,
        referralCode: userData?.referralCode || generateReferralCode(user.id)
      }
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch referral stats" },
      { status: 500 }
    );
  }
}

function generateReferralCode(userId: string): string {
  // Generate a unique referral code based on user ID
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `${userId.substring(0, 3)}${timestamp}${random}`.toUpperCase();
} 