import { notFound } from "next/navigation";
import Agent from "@/app/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";

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
		<div className="min-h-screen bg-dark-100 py-12">
			<div className="container mx-auto px-4">
				{/* Header Section */}
				<section className="mb-12 text-center">
					<h1 className="text-3xl font-semibold text-white md:text-4xl">
						{interview.role} Interview
					</h1>
					<p className="mt-2 text-sm text-light-300 md:text-base">
						{interview.type} Interview • {interview.level} Level
					</p>
					<div className="mt-4 flex flex-wrap justify-center gap-2">
						{interview.techstack.map((tech) => (
							<span
								key={tech}
								className="rounded-full bg-dark-300 px-3 py-1 text-xs font-medium text-light-400 shadow-sm"
							>
								{tech}
							</span>
						))}
					</div>
					<p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-light-400 md:text-base">
						Get ready for your {interview.type.toLowerCase()} interview for a{" "}
						{interview.level.toLowerCase()} {interview.role.toLowerCase()}{" "}
						position. The AI interviewer will evaluate your skills with
						questions tailored to your experience. When you're prepared, click
						"Call" to start.
					</p>
				</section>

				{/* Agent Section */}
				<div className="mx-auto max-w-4xl rounded-lg bg-dark-200 p-6 shadow-lg">
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
		</div>
	);
};

export default InterviewPage;
