"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { Interview } from "@/constants";

interface FeedbackParams {
  interviewId: string;
  userId: string;
  transcript: any[];
  feedbackId: string;
}

export async function createFeedback({ 
  interviewId, 
  userId, 
  transcript, 
  feedbackId 
}: FeedbackParams): Promise<{ success: boolean; feedbackId: string | null }> {
  try {
    // If a feedback ID is provided, update it; otherwise, create a new one
    const feedbackRef = feedbackId 
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    // Create the feedback data
    const feedbackData = {
      interviewId,
      userId,
      transcript,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    await feedbackRef.set(feedbackData, { merge: true });

    // Update the interview status to completed
    await db.collection("interviews").doc(interviewId).update({
      status: "completed",
      updatedAt: new Date(),
    });

    // Return the feedback ID
    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { success: false, feedbackId: null };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId({ 
  interviewId, 
  userId 
}: { 
  interviewId: string; 
  userId: string 
}): Promise<any | null> {
  if (!interviewId || !userId) return null;

  try {
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return {
      id: feedbackDoc.id,
      ...feedbackDoc.data(),
    };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
}

export async function getLatestInterviews({ userId, limit = 5 }: { userId: string; limit?: number }): Promise<Interview[]> {
  if (!userId) return [];

  try {
    // Simplified query that doesn't require a composite index
    const querySnapshot = await db
      .collection("interviews")
      .limit(limit)
      .get();

    const interviews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    return interviews;
  } catch (error) {
    console.error("Error fetching latest interviews:", error);
    return [];
  }
}

export async function getInterviewsByUserId(userId: string): Promise<Interview[]> {
  if (!userId) return [];

  try {
    const querySnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();

    const interviews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    return interviews;
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
}

export async function createInterview({
  userId,
  role,
  type,
  techstack,
  level,
  questions,
  finalized = true,
}: {
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  level: string;
  questions: string[];
  finalized?: boolean;
}): Promise<{ success: boolean; interviewId: string | null }> {
  try {
    const interviewRef = db.collection("interviews").doc();
    
    const interviewData = {
      userId,
      role,
      type,
      techstack,
      level,
      questions,
      finalized,
      status: "available",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await interviewRef.set(interviewData);
    
    return { success: true, interviewId: interviewRef.id };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false, interviewId: null };
  }
}

export async function updateInterview({
  interviewId,
  data,
}: {
  interviewId: string;
  data: Partial<Interview>;
}): Promise<{ success: boolean }> {
  try {
    const interviewRef = db.collection("interviews").doc(interviewId);
    
    await interviewRef.update({
      ...data,
      updatedAt: new Date(),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating interview:", error);
    return { success: false };
  }
}
