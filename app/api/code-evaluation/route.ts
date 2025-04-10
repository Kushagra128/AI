import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

async function evaluateCode(code: string, language: string, testCases: any[]) {
  // This is a placeholder for actual code evaluation logic
  // You would typically:
  // 1. Set up a secure sandbox environment
  // 2. Execute the code with test cases
  // 3. Analyze the results
  // 4. Return evaluation metrics

  const results = testCases.map(test => ({
    passed: Math.random() > 0.5, // Placeholder
    message: "Test executed successfully",
    executionTime: Math.random() * 1000 // Placeholder
  }));

  const score = results.filter(r => r.passed).length / results.length * 100;

  return {
    testResults: results,
    score,
    feedback: "Code evaluation completed successfully"
  };
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { code, language, testCases, interviewId } = await request.json();
    
    const evaluation = await evaluateCode(code, language, testCases);
    
    const docRef = await db.collection("codeEvaluations").add({
      interviewId,
      userId: user.id,
      code,
      language,
      ...evaluation,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...evaluation }
    });
  } catch (error) {
    console.error("Error evaluating code:", error);
    return NextResponse.json({ success: false, error: "Failed to evaluate code" }, { status: 500 });
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

    let query = db.collection("codeEvaluations").where("userId", "==", user.id);
    if (interviewId) {
      query = query.where("interviewId", "==", interviewId);
    }

    const evaluations = await query.orderBy("createdAt", "desc").get();
    
    return NextResponse.json({
      success: true,
      data: evaluations.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    });
  } catch (error) {
    console.error("Error fetching code evaluations:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch code evaluations" }, { status: 500 });
  }
} 