import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get all referrals for the user
    const referrals = await db
      .collection("referrals")
      .where("referrerId", "==", user.id)
      .orderBy("date", "desc")
      .get();

    // Get referred users' details
    const referralHistory = await Promise.all(
      referrals.docs.map(async (doc) => {
        const data = doc.data();
        const referredUser = await db
          .collection("users")
          .doc(data.referredUserId)
          .get();
        const userData = referredUser.data();

        return {
          id: doc.id,
          referredUser: userData?.name || "Anonymous User",
          date: data.date,
          status: data.status,
          reward: data.reward || 0
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: referralHistory
    });
  } catch (error) {
    console.error("Error fetching referral history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch referral history" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { referredUserId } = await request.json();

    // Create new referral
    const docRef = await db.collection("referrals").add({
      referrerId: user.id,
      referredUserId,
      date: new Date().toISOString(),
      status: "pending",
      reward: 0
    });

    // Get current total referrals
    const userDoc = await db.collection("users").doc(user.id).get();
    const currentTotal = userDoc.data()?.totalReferrals || 0;

    // Update referrer's stats
    await db.collection("users").doc(user.id).update({
      totalReferrals: currentTotal + 1
    });

    return NextResponse.json({
      success: true,
      data: { id: docRef.id }
    });
  } catch (error) {
    console.error("Error creating referral:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create referral" },
      { status: 500 }
    );
  }
} 