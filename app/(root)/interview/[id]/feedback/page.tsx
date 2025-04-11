import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Footer from "@/app/components/Footer";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
	getFeedbackByInterviewId,
	getInterviewById,
} from "@/lib/actions/general.action";
import { formatDate } from "@/lib/utils";

interface PageProps {
	params: { id: string };
}

interface CategoryScore {
	name: string;
	score: number;
	comment?: string; // Optional since it's not always present
}

const FeedbackPage = async ({ params }: PageProps) => {
	const user = await getCurrentUser();
	if (!user) return notFound();

	// Make sure to await the params
	const interviewId = await Promise.resolve(params.id);
	const [interview, feedback] = await Promise.all([
		getInterviewById(interviewId),
		getFeedbackByInterviewId({ interviewId, userId: user.id }),
	]);

	if (!interview || !feedback) return notFound();

	const categoryScores: CategoryScore[] = feedback.categoryScores || [
		{
			name: "Communication Skills",
			score: 85,
			comment: "Clear and articulate.",
		},
		{
			name: "Technical Knowledge",
			score: 78,
			comment: "Solid with minor gaps.",
		},
		{ name: "Problem Solving", score: 82, comment: "Systematic approach." },
		{ name: "Cultural Fit", score: 90, comment: "Strong team alignment." },
		{
			name: "Confidence and Clarity",
			score: 80,
			comment: "Good with some hesitation.",
		},
	];

	const strengths: string[] = feedback.strengths || [
		"Strong communication skills",
		"Good algorithmic understanding",
		"Systematic problem-solving",
	];

	const areasForImprovement: string[] = feedback.areasForImprovement || [
		"Deepen system design knowledge",
		"Consider more edge cases",
		"Practice concise explanations",
	];

	const totalScore: number = feedback.totalScore || 83;

	return (
		<div className="min-h-screen bg-dark-100 py-12">
			<div className="container mx-auto px-4">
				{/* Back Link */}
				<Link
					href="/dashboard"
					className="mb-8 flex w-fit items-center text-light-300 transition-colors hover:text-primary-200"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Dashboard
				</Link>

				{/* Main Feedback Card */}
				<div className="rounded-xl bg-dark-200 shadow-lg">
					{/* Header */}
					<div className="border-b border-dark-300 p-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h1 className="text-2xl font-semibold text-white md:text-3xl">
									{interview.role} Interview Feedback
								</h1>
								<p className="mt-1 text-sm text-light-400">
									{formatDate(interview.createdAt)}
								</p>
							</div>
							<div className="flex gap-3">
								<button className="flex items-center rounded-full border border-dark-300 bg-dark-300 px-4 py-2 text-sm text-light-300 transition-colors hover:bg-dark-400">
									<Download className="mr-2 h-4 w-4" />
									Export
								</button>
								<button className="flex items-center rounded-full border border-dark-300 bg-dark-300 px-4 py-2 text-sm text-light-300 transition-colors hover:bg-dark-400">
									<Share2 className="mr-2 h-4 w-4" />
									Share
								</button>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-6">
						{/* Overall Assessment & Score */}
						<div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
							<div className="md:col-span-2">
								<h2 className="mb-4 text-xl font-semibold text-white">
									Overall Assessment
								</h2>
								<p className="text-sm leading-relaxed text-light-300">
									{feedback.finalAssessment ||
										"The candidate showed strong performance across key areas with clear communication and solid technical skills. Improvement in system design and edge-case handling could elevate their performance further. A commendable effort suitable for mid-level roles."}
								</p>
							</div>
							<div className="flex flex-col items-center rounded-lg bg-dark-300 p-6">
								<div className="relative mb-4">
									<svg className="h-32 w-32" viewBox="0 0 100 100">
										<circle
											cx="50"
											cy="50"
											r="45"
											fill="none"
											stroke="#2A2D3A"
											strokeWidth="10"
										/>
										<circle
											cx="50"
											cy="50"
											r="45"
											fill="none"
											stroke="#22c55e"
											strokeWidth="10"
											strokeDasharray={`${
												(2 * Math.PI * 45 * totalScore) / 100
											} ${(2 * Math.PI * 45 * (100 - totalScore)) / 100}`}
											strokeDashoffset={`${2 * Math.PI * 45 * 0.25}`}
											strokeLinecap="round"
										/>
									</svg>
									<div className="absolute inset-0 flex flex-col items-center justify-center">
										<span className="text-3xl font-bold text-white">
											{totalScore}
										</span>
										<span className="text-xs text-light-400">/100</span>
									</div>
								</div>
								<h3 className="text-lg font-medium text-white">
									Overall Score
								</h3>
								<p className="mt-2 text-center text-sm text-light-400">
									{totalScore >= 90
										? "Outstanding!"
										: totalScore >= 80
										? "Great Job!"
										: totalScore >= 70
										? "Solid Effort"
										: "Keep Practicing"}
								</p>
							</div>
						</div>

						{/* Category Scores */}
						<div className="mb-10 bg-dark-300 p-6 rounded-lg">
							<h2 className="mb-4 text-xl font-semibold text-white">
								Performance by Category
							</h2>
							<div className="space-y-6">
								{categoryScores.map((category, index) => (
									<div key={index}>
										<div className="mb-1 flex items-center justify-between">
											<span className="text-sm font-medium text-white">
												{category.name}
											</span>
											<span className="text-sm text-primary-200">
												{category.score}/100
											</span>
										</div>
										<div className="h-2 w-full overflow-hidden rounded-full bg-dark-400">
											<div
												className={`h-full rounded-full transition-all ${
													category.score >= 90
														? "bg-green-500"
														: category.score >= 75
														? "bg-primary-200"
														: category.score >= 60
														? "bg-yellow-500"
														: "bg-red-500"
												}`}
												style={{ width: `${category.score}%` }}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Strengths & Areas for Improvement */}
						<div className="bg-dark-300 p-6 rounded-lg mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
							<h2 className="text-xl font-semibold text-white">Strengths</h2>
							<div>
								<ul className="space-y-3">
									{strengths.map((strength, index) => (
										<li key={index} className="flex items-start gap-2">
											<span className="mt-2 h-2 w-2 rounded-full bg-green-500" />
											<span className="text-sm text-white">{strength}</span>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h2 className="mb-4 text-xl font-semibold text-white">
									Areas for Improvement
								</h2>
								<ul className="space-y-3">
									{areasForImprovement.map((area, index) => (
										<li key={index} className="flex items-start gap-2">
											<span className="mt-2 h-2 w-2 rounded-full bg-yellow-500" />
											<span className="text-sm text-white">{area}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Next Steps */}
						<div className="rounded-lg bg-dark-300 p-6">
							<h2 className="mb-4 text-xl font-semibold text-white">
								Next Steps
							</h2>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								{[
									{
										href: `/interview/${interviewId}`,
										icon: "/practice.svg",
										title: "Practice Again",
										desc: "Retake this interview",
									},
									{
										href: "/resources",
										icon: "/resources.svg",
										title: "Study Resources",
										desc: "Access learning materials",
									},
									{
										href: "/performance",
										icon: "/analytics.svg",
										title: "View Performance",
										desc: "Track your progress over time",
									},
								].map(({ href, icon, title, desc }) => (
									<Link
										key={title}
										href={href}
										className="flex flex-col items-center rounded-lg border border-dark-400 bg-dark-200 p-4 text-center transition-colors hover:bg-dark-300"
									>
										<Image
											src={icon}
											alt={title}
											width={48}
											height={48}
											className="mb-3"
										/>
										<h3 className="text-sm font-medium text-white">{title}</h3>
										<p className="mt-1 text-xs text-light-400">{desc}</p>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default FeedbackPage;
