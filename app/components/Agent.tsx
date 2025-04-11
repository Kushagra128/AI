"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewerTemplate } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
	INACTIVE = "INACTIVE",
	CONNECTING = "CONNECTING",
	ACTIVE = "ACTIVE",
	FINISHED = "FINISHED",
	ERROR = "ERROR",
}

interface SavedMessage {
	role: "user" | "system" | "assistant";
	content: string;
}

interface AgentProps {
	userName: string;
	userId: string;
	interviewId?: string;
	feedbackId?: string;
	type: "generate" | "interview";
	questions?: string[];
}

const Agent = ({
	userName,
	userId,
	interviewId = "",
	feedbackId = "",
	type,
	questions = [],
}: AgentProps) => {
	const router = useRouter();
	const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
	const [messages, setMessages] = useState<SavedMessage[]>([]);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [lastMessage, setLastMessage] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [audioSupported, setAudioSupported] = useState<boolean | null>(null);

	// Check audio support when component mounts
	useEffect(() => {
		const checkAudioSupport = async () => {
			try {
				// Check if browser supports getUserMedia
				if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
					setAudioSupported(false);
					return;
				}

				// Try to access the microphone
				await navigator.mediaDevices.getUserMedia({ audio: true });
				setAudioSupported(true);
			} catch (error) {
				console.error("Audio not supported:", error);
				setAudioSupported(false);
			}
		};

		checkAudioSupport();
	}, []);

	useEffect(() => {
		const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
		const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
		const onMessage = (message: any) => {
			if (message.type === "transcript" && message.transcriptType === "final") {
				const newMessage = { role: message.role, content: message.transcript };
				setMessages((prev) => [...prev, newMessage]);
			}
		};
		const onSpeechStart = () => setIsSpeaking(true);
		const onSpeechEnd = () => setIsSpeaking(false);
		const onError = (error: Error) => {
			console.error("VAPI Error:", error);
			setErrorMessage(
				"There was an error connecting to the AI interviewer. Please try again."
			);
			setCallStatus(CallStatus.ERROR);
		};

		vapi.on("call-start", onCallStart);
		vapi.on("call-end", onCallEnd);
		vapi.on("message", onMessage);
		vapi.on("speech-start", onSpeechStart);
		vapi.on("speech-end", onSpeechEnd);
		vapi.on("error", onError);

		return () => {
			vapi.off("call-start", onCallStart);
			vapi.off("call-end", onCallEnd);
			vapi.off("message", onMessage);
			vapi.off("speech-start", onSpeechStart);
			vapi.off("speech-end", onSpeechEnd);
			vapi.off("error", onError);
		};
	}, []);

	useEffect(() => {
		if (messages.length > 0) {
			setLastMessage(messages[messages.length - 1].content);
		}

		const handleGenerateFeedback = async (transcript: SavedMessage[]) => {
			if (!interviewId || !userId || !feedbackId) {
				console.error("Missing required IDs for feedback");
				router.push("/");
				return;
			}

			try {
				// First update the interview status to completed
				const { success: updateSuccess } = await fetch(
					"/api/interviews/status",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							interviewId,
							status: "completed",
						}),
					}
				).then((res) => res.json());

				if (!updateSuccess) {
					console.error("Failed to update interview status");
				}

				// Analyze the transcript to generate more realistic scores
				const technicalScore = analyzeTechnicalKnowledge(transcript);
				const communicationScore = analyzeCommunication(transcript);
				const problemSolvingScore = analyzeProblemSolving(transcript);
				const totalScore = Math.round(
					(technicalScore + communicationScore + problemSolvingScore) / 3
				);

				// Generate strengths and areas for improvement based on scores
				const strengths = [];
				const areasForImprovement = [];

				if (technicalScore >= 80) strengths.push("Strong technical knowledge");
				else if (technicalScore < 70)
					areasForImprovement.push("Need to strengthen technical concepts");

				if (communicationScore >= 80)
					strengths.push("Excellent communication skills");
				else if (communicationScore < 70)
					areasForImprovement.push("Work on clear and concise communication");

				if (problemSolvingScore >= 80)
					strengths.push("Strong problem-solving abilities");
				else if (problemSolvingScore < 70)
					areasForImprovement.push("Practice more complex problem scenarios");

				// Then create the feedback with analyzed scores
				const { success, feedbackId: id } = await createFeedback({
					interviewId,
					userId,
					transcript,
					feedbackId,
				});

				if (success && id) {
					// Update the feedback with analyzed scores
					try {
						await fetch(`/api/feedback/${id}`, {
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								totalScore,
								finalAssessment: generateFinalAssessment(
									totalScore,
									strengths,
									areasForImprovement
								),
								categoryScores: [
									{
										name: "Technical Knowledge",
										score: technicalScore,
										comment: generateCategoryComment(
											"Technical Knowledge",
											technicalScore
										),
									},
									{
										name: "Communication",
										score: communicationScore,
										comment: generateCategoryComment(
											"Communication",
											communicationScore
										),
									},
									{
										name: "Problem Solving",
										score: problemSolvingScore,
										comment: generateCategoryComment(
											"Problem Solving",
											problemSolvingScore
										),
									},
								],
								strengths,
								areasForImprovement,
							}),
						});
					} catch (error) {
						console.error("Error updating feedback with score:", error);
					}

					router.push(`/interview/${interviewId}/feedback`);
				} else {
					console.error("Failed to save feedback");
					router.push("/");
				}
			} catch (error) {
				console.error("Error creating feedback:", error);
				router.push("/");
			}
		};

		if (callStatus === CallStatus.FINISHED) {
			if (type === "generate") {
				router.push("/");
			} else if (messages.length > 0) {
				handleGenerateFeedback(messages);
			}
		}
	}, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

	// Helper functions for score analysis
	const analyzeTechnicalKnowledge = (transcript: SavedMessage[]): number => {
		// Count technical terms and concepts
		const technicalTerms = transcript.filter(
			(msg) =>
				msg.role === "user" &&
				(msg.content.toLowerCase().includes("algorithm") ||
					msg.content.toLowerCase().includes("complexity") ||
					msg.content.toLowerCase().includes("data structure") ||
					msg.content.toLowerCase().includes("api") ||
					msg.content.toLowerCase().includes("framework"))
		).length;

		// Base score on technical term usage and response length
		const baseScore = Math.min(70 + technicalTerms * 5, 100);
		return Math.round(baseScore);
	};

	const analyzeCommunication = (transcript: SavedMessage[]): number => {
		// Analyze response length and structure
		const userResponses = transcript.filter((msg) => msg.role === "user");
		const avgResponseLength =
			userResponses.reduce(
				(acc, curr) => acc + curr.content.split(" ").length,
				0
			) / userResponses.length;

		// Base score on response length and clarity
		const baseScore = Math.min(70 + avgResponseLength / 2, 100);
		return Math.round(baseScore);
	};

	const analyzeProblemSolving = (transcript: SavedMessage[]): number => {
		// Look for problem-solving indicators
		const problemSolvingIndicators = transcript.filter(
			(msg) =>
				msg.role === "user" &&
				(msg.content.toLowerCase().includes("approach") ||
					msg.content.toLowerCase().includes("solution") ||
					msg.content.toLowerCase().includes("step") ||
					msg.content.toLowerCase().includes("consider"))
		).length;

		// Base score on problem-solving indicators
		const baseScore = Math.min(70 + problemSolvingIndicators * 5, 100);
		return Math.round(baseScore);
	};

	const generateCategoryComment = (category: string, score: number): string => {
		if (score >= 90)
			return `Excellent ${category.toLowerCase()} skills demonstrated throughout the interview.`;
		if (score >= 80) return `Strong ${category.toLowerCase()} abilities shown.`;
		if (score >= 70)
			return `Good ${category.toLowerCase()} skills with room for improvement.`;
		return `Needs improvement in ${category.toLowerCase()} aspects.`;
	};

	const generateFinalAssessment = (
		totalScore: number,
		strengths: string[],
		areasForImprovement: string[]
	): string => {
		let assessment = "Overall Assessment: ";

		if (totalScore >= 90) {
			assessment += "Outstanding performance! ";
		} else if (totalScore >= 80) {
			assessment += "Very good performance! ";
		} else if (totalScore >= 70) {
			assessment += "Good performance with some areas to improve. ";
		} else {
			assessment += "Performance needs improvement. ";
		}

		if (strengths.length > 0) {
			assessment += `\n\nStrengths:\n${strengths.join("\n")}`;
		}

		if (areasForImprovement.length > 0) {
			assessment += `\n\nAreas for Improvement:\n${areasForImprovement.join(
				"\n"
			)}`;
		}

		return assessment;
	};

	const handleCall = useCallback(async () => {
		setCallStatus(CallStatus.CONNECTING);
		setErrorMessage("");

		// If audio is not supported, use mock interview flow
		if (audioSupported === false) {
			console.warn(
				"Audio input not supported on this browser or device, using mock interview"
			);
			setCallStatus(CallStatus.ACTIVE);

			// Simulate interviewer message based on interview type
			setTimeout(() => {
				const mockMessage: SavedMessage = {
					role: "assistant",
					content:
						type === "generate"
							? "Hello! I'm your AI interviewer. Let's start with generating questions."
							: `Hello! I'm your AI interviewer. Let's start with the first question: ${
									questions[0] || "Tell me about yourself."
							  }`,
				};
				setMessages((prev) => [...prev, mockMessage]);
				setIsSpeaking(true);

				// End speaking after 3 seconds
				setTimeout(() => {
					setIsSpeaking(false);
				}, 3000);
			}, 1000);
			return;
		}

		try {
			if (type === "generate") {
				const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
				if (!workflowId) {
					setErrorMessage(
						"Missing VAPI workflow ID configuration. Please check your environment settings."
					);
					setCallStatus(CallStatus.ERROR);
					return;
				}

				// Check API key is available
				if (
					!process.env.NEXT_PUBLIC_VAPI_API_KEY &&
					!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN
				) {
					console.warn("VAPI API key not configured, using mock interview");
					setCallStatus(CallStatus.ACTIVE);
					// Simulate interviewer message
					setTimeout(() => {
						const mockMessage: SavedMessage = {
							role: "assistant",
							content:
								"Hello! I'm your AI interviewer. Let's start with generating questions.",
						};
						setMessages((prev) => [...prev, mockMessage]);
						setIsSpeaking(true);

						// End speaking after 3 seconds
						setTimeout(() => {
							setIsSpeaking(false);
						}, 3000);
					}, 1000);
					return;
				}

				try {
					await vapi.start(workflowId, {
						variableValues: { username: userName, userid: userId },
					});
				} catch (vapiError) {
					console.error("VAPI start error:", vapiError);
					setErrorMessage(
						"Failed to start the interview. Please refresh the page and try again."
					);
					setCallStatus(CallStatus.ERROR);
				}
			} else {
				if (!questions.length) {
					setErrorMessage("No questions provided for this interview.");
					setCallStatus(CallStatus.ERROR);
					return;
				}

				const formattedQuestions = questions.map((q) => `- ${q}`).join("\n");

				// Use a mock local interview if VAPI isn't configured
				if (
					!process.env.NEXT_PUBLIC_VAPI_API_KEY &&
					!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN
				) {
					console.warn("VAPI API key not configured, using mock interview");
					setCallStatus(CallStatus.ACTIVE);
					// Simulate interviewer message
					setTimeout(() => {
						const mockMessage: SavedMessage = {
							role: "assistant",
							content:
								"Hello! I'm your AI interviewer. Let's start with the first question: " +
								questions[0],
						};
						setMessages((prev) => [...prev, mockMessage]);
						setIsSpeaking(true);

						// End speaking after 3 seconds
						setTimeout(() => {
							setIsSpeaking(false);
						}, 3000);
					}, 1000);
					return;
				}

				// Real VAPI implementation
				try {
					await vapi.start(interviewerTemplate, {
						variableValues: { questions: formattedQuestions },
					});
				} catch (vapiError) {
					console.error("VAPI start error:", vapiError);
					setErrorMessage(
						"Failed to start the interview. Please refresh the page and try again."
					);
					setCallStatus(CallStatus.ERROR);
				}
			}
		} catch (error) {
			console.error("Call initiation failed:", error);
			setErrorMessage(
				"Failed to start interview. Please check your connection and try again."
			);
			setCallStatus(CallStatus.ERROR);
		}
	}, [type, userName, userId, questions, audioSupported]);

	const handleDisconnect = useCallback(() => {
		vapi.stop();
		setCallStatus(CallStatus.FINISHED);
	}, []);

	const handleRetry = useCallback(() => {
		setCallStatus(CallStatus.INACTIVE);
		setErrorMessage("");
		setMessages([]);
	}, []);

	return (
		<div className="flex flex-col gap-6">
			{/* Interviewer and User Cards */}
			<div className="call-view">
				<div className="card-interviewer">
					<div className="avatar">
						<Image
							src="/ai-avatar.png"
							alt="AI Interviewer Avatar"
							width={65}
							height={54}
							className="object-cover"
						/>
						{isSpeaking && <span className="animate-speak" />}
					</div>
					<h3>AI Interviewer</h3>
				</div>

				<div className="card-border">
					<div className="card-content">
						<Image
							src="/user-avatar.png"
							alt={`${userName}'s Avatar`}
							width={120}
							height={120}
							className="rounded-full object-cover"
						/>
						<h3>{userName}</h3>
					</div>
				</div>
			</div>

			{/* Audio Support Warning */}
			{audioSupported === false && (
				<div className="p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-white mb-4">
					<p className="mb-2">
						Your browser doesn't support audio input. The interview will run in
						text-only mode.
					</p>
				</div>
			)}

			{/* Error Message */}
			{errorMessage && (
				<div className="p-4 bg-destructive-100/20 border border-destructive-100 rounded-lg text-white">
					<p className="mb-2">{errorMessage}</p>
					<button
						onClick={handleRetry}
						className="text-sm px-3 py-1 bg-destructive-100 text-white rounded-md hover:bg-destructive-200 transition-colors"
					>
						Retry
					</button>
				</div>
			)}

			{/* Transcript Display */}
			{messages.length > 0 && (
				<div className="transcript-border">
					<div className="transcript">
						<p
							key={lastMessage}
							className={cn("animate-fadeIn transition-opacity duration-500")}
						>
							{lastMessage}
						</p>
					</div>
				</div>
			)}

			{/* Call Controls */}
			<div className="w-full flex justify-center">
				{callStatus === CallStatus.INACTIVE ||
				callStatus === CallStatus.ERROR ? (
					<button className="relative btn-call" onClick={handleCall}>
						<span className="relative">Call</span>
					</button>
				) : callStatus === CallStatus.CONNECTING ? (
					<button className="relative btn-call" disabled>
						<span className="absolute animate-ping rounded-full opacity-75"></span>
						<span className="relative">. . .</span>
					</button>
				) : callStatus === CallStatus.ACTIVE ? (
					<button className="btn-disconnect" onClick={handleDisconnect}>
						End
					</button>
				) : (
					<button
						className="btn-primary"
						onClick={() => router.push("/dashboard")}
					>
						Return to Dashboard
					</button>
				)}
			</div>
		</div>
	);
};

export default Agent;
