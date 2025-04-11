import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface FeedbackDoc {
  id: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
  }>;
  areasForImprovement: string[];
  strengths: string[];
  createdAt: string;
  interviewId: string;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get all interviews for the user
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", user.id)
      .orderBy("createdAt", "desc")
      .get();

    // Get all feedback for the user's interviews
    const interviewIds = interviews.docs.map(doc => doc.id);
    const feedback = await db
      .collection("feedback")
      .where("interviewId", "in", interviewIds)
      .orderBy("createdAt", "desc")
      .get();

    // Calculate statistics
    const totalInterviews = interviews.size;
    const feedbackDocs = feedback.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FeedbackDoc[];
    
    // Calculate average score
    const averageScore = feedbackDocs.length > 0
      ? feedbackDocs.reduce((acc, curr) => acc + curr.totalScore, 0) / feedbackDocs.length
      : 0;

    // Calculate category averages
    const categoryAverages: { [key: string]: number } = {};
    const categoryCounts: { [key: string]: number } = {};
    
    feedbackDocs.forEach(doc => {
      doc.categoryScores.forEach(category => {
        if (!categoryAverages[category.name]) {
          categoryAverages[category.name] = 0;
          categoryCounts[category.name] = 0;
        }
        categoryAverages[category.name] += category.score;
        categoryCounts[category.name]++;
      });
    });

    Object.keys(categoryAverages).forEach(category => {
      categoryAverages[category] = categoryCounts[category] > 0 
        ? categoryAverages[category] / categoryCounts[category]
        : 0;
    });

    // Get improvement areas and strengths from all feedback
    const improvementAreas = new Set<string>();
    const strengthsSet = new Set<string>();
    
    feedbackDocs.forEach(doc => {
      doc.areasForImprovement.forEach(area => improvementAreas.add(area));
      doc.strengths.forEach(strength => strengthsSet.add(strength));
    });

    // Calculate progress over time
    const progress = feedbackDocs
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(doc => ({
        date: doc.createdAt,
        score: doc.totalScore
      }));

    // Get recent interviews with scores
    const recentInterviews = interviews.docs.slice(0, 5).map(doc => {
      const interviewData = doc.data();
      const interviewFeedback = feedbackDocs.find(f => f.interviewId === doc.id);
      return {
        id: doc.id,
        ...interviewData,
        score: interviewFeedback?.totalScore || 0
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalInterviews,
        averageScore,
        categoryAverages,
        improvementAreas: Array.from(improvementAreas),
        strengths: Array.from(strengthsSet),
        progress,
        recentInterviews
      }
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
} 