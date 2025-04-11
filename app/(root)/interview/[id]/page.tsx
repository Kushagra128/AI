import { notFound } from "next/navigation";
import Agent from "@/app/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";
import { ArrowLeft, Clock, Code, Brain, Award } from "lucide-react";
import Link from "next/link";
import Footer from "@/app/components/Footer";

interface PageProps {
	params: { id: string };
}

const InterviewPage = async ({ params }: PageProps) => {
	const user = await getCurrentUser();
	if (!user) return notFound();

	const interviewId = params.id;
	const interview = await getInterviewById(interviewId);
	if (!interview) return notFound();

	// Generate a unique feedback ID
	const feedbackId = `feedback_${Date.now()}_${Math.random()
		.toString(36)
		.substring(2, 9)}`;

	return (
		<div className="min-h-screen bg-dark-100">
			{/* Back Navigation */}
			<div className="container mx-auto px-4 py-4">
				<Link
					href="/dashboard"
					className="inline-flex items-center text-light-300 hover:text-primary-200 transition-colors"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Dashboard
				</Link>
			</div>

			<div className="container mx-auto px-4 py-8">
				{/* Header Section with Gradient Background */}
				<section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900/20 to-primary-800/20 p-8 shadow-xl">
					{/* Decorative Elements */}
					<div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl"></div>
					<div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary-500/10 blur-3xl"></div>

					<div className="relative z-10">
						<div className="flex flex-col items-center text-center">
							<h1 className="text-4xl font-bold text-white md:text-5xl">
								{interview.role} Interview
							</h1>
							<div className="mt-4 flex items-center space-x-2 text-primary-200">
								<Brain className="h-5 w-5" />
								<span className="text-lg font-medium">{interview.type}</span>
								<span className="mx-2">•</span>
								<Award className="h-5 w-5" />
								<span className="text-lg font-medium">
									{interview.level} Level
								</span>
							</div>

							{/* Tech Stack Pills */}
							<div className="mt-6 flex flex-wrap justify-center gap-2">
								{interview.techstack.map((tech) => (
									<span
										key={tech}
										className="rounded-full bg-dark-300/80 px-4 py-1.5 text-sm font-medium text-light-300 shadow-sm backdrop-blur-sm transition-all hover:bg-primary-900/30 hover:text-primary-200"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Interview Info Cards */}
				<div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
					<div className="rounded-xl bg-dark-200 p-6 shadow-lg transition-all hover:shadow-primary-900/10">
						<div className="flex items-center space-x-3">
							<div className="rounded-full bg-primary-900/20 p-3">
								<Clock className="h-6 w-6 text-primary-200" />
							</div>
							<div>
								<h3 className="text-sm font-medium text-light-400">Duration</h3>
								<p className="text-lg font-semibold text-white">
									30-45 minutes
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-xl bg-dark-200 p-6 shadow-lg transition-all hover:shadow-primary-900/10">
						<div className="flex items-center space-x-3">
							<div className="rounded-full bg-primary-900/20 p-3">
								<Code className="h-6 w-6 text-primary-200" />
							</div>
							<div>
								<h3 className="text-sm font-medium text-light-400">
									Questions
								</h3>
								<p className="text-lg font-semibold text-white">
									{interview.questions.length} Questions
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-xl bg-dark-200 p-6 shadow-lg transition-all hover:shadow-primary-900/10">
						<div className="flex items-center space-x-3">
							<div className="rounded-full bg-primary-900/20 p-3">
								<Brain className="h-6 w-6 text-primary-200" />
							</div>
							<div>
								<h3 className="text-sm font-medium text-light-400">
									AI Interviewer
								</h3>
								<p className="text-lg font-semibold text-white">
									Ready to Start
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Interview Description */}
				<div className="mb-12 rounded-xl bg-dark-200 p-8 shadow-lg">
					<h2 className="mb-4 text-xl font-semibold text-white">
						Interview Overview
					</h2>
					<p className="text-light-300 leading-relaxed">
						Get ready for your {interview.type.toLowerCase()} interview for a{" "}
						{interview.level.toLowerCase()} {interview.role.toLowerCase()}{" "}
						position. The AI interviewer will evaluate your skills with
						questions tailored to your experience level and technical stack. The
						interview will focus on assessing your knowledge of{" "}
						{interview.techstack.join(", ")}
						and your ability to solve problems in a{" "}
						{interview.level.toLowerCase()} complexity environment.
					</p>
				</div>

				{/* Agent Section with Enhanced Styling */}
				<div className="mx-auto max-w-4xl rounded-xl bg-dark-200 p-8 shadow-lg">
					<Agent
						userName={user.name || "User"}
						userId={user.id}
						interviewId={interviewId}
						feedbackId={feedbackId}
						type="interview"
						questions={interview.questions}
					/>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default InterviewPage;
