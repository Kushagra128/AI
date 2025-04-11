import { getCurrentUser } from "@/lib/actions/auth.action";
import {
	getInterviewsByUserId,
	getLatestInterviews,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import PerformanceChart from "@/app/components/PerformanceChart";
import Link from "next/link";
import { Plus, Video, Code, Brain, Award } from "lucide-react";
import InterviewCard from "@/app/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Footer from "@/app/components/Footer";

interface Interview {
	id: string;
	role: string;
	type: string;
	techstack: string[];
	createdAt: Date;
	status: "available" | "in_progress" | "completed";
	score?: number;
}

export default async function DashboardPage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/sign-in");
	}

	const [userInterviews, allInterviews] = await Promise.all([
		getInterviewsByUserId(user.id),
		getLatestInterviews({ userId: user.id }),
	]);

	const interviews: Interview[] = (userInterviews || []).map((interview) => ({
		...interview,
		createdAt: new Date(interview.createdAt),
		status: interview.status || "available", // Provide default status if undefined
	}));
	const hasPastInterviews = interviews.length > 0;
	const hasUpcomingInterviews = allInterviews
		? allInterviews.length > 0
		: false;

	// Calculate statistics
	const totalInterviews = interviews.length;
	const completedInterviews = interviews.filter(
		(i) => i.status === "completed"
	).length;
	const averageScore =
		completedInterviews > 0
			? interviews
					.filter((i) => i.status === "completed")
					.reduce((acc, curr) => acc + (curr.score || 0), 0) /
			  completedInterviews
			: 0;

	// Prepare data for chart
	const chartData = interviews
		.filter((i) => i.status === "completed")
		.map((i) => ({
			name: i.type,
			score: i.score || 0,
		}))
		.slice(-5); // Show last 5 completed interviews

	// Group interviews by status
	const availableInterviews = interviews.filter(
		(i) => i.status === "available"
	);
	const inProgressInterviews = interviews.filter(
		(i) => i.status === "in_progress"
	);
	const completedInterviewsList = interviews.filter(
		(i) => i.status === "completed"
	);

	return (
		<div className="root-layout">
			<div className="container mx-auto px-4 py-8">
				{/* Hero Section */}
				<section className="bg-gradient-to-r from-dark-100 via-dark-200 to-dark-100 py-20">
					<div className="container mx-auto px-4">
						<div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
							{/* Left Content */}
							<div className="max-w-2xl text-center lg:text-left">
								<h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
									Master Your Next Interview with Confidence
								</h1>
								<p className="mb-6 text-lg text-light-400">
									Elevate your skills with tailored practice for technical,
									behavioral, and system design interviews. Our platform
									provides real-world scenarios, expert insights, and actionable
									feedback to help you succeed in today's competitive job
									market.
								</p>
								<Button
									asChild
									className="btn-primary inline-flex items-center px-6 py-3 text-lg"
								>
									<Link href="/interview">
										<Plus className="mr-2 h-5 w-5" />
										Start Your Interview Journey
									</Link>
								</Button>
							</div>

							{/* Right Stats Preview */}
							<div className="w-full max-w-md">
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div className="card bg-dark-300 p-6 shadow-lg transition-transform hover:scale-105">
										<h3 className="text-light-400">Practice Areas</h3>
										<p className="mt-2 text-3xl font-bold text-primary-200">
											3
										</p>
										<p className="text-sm text-light-500">
											Technical, Behavioral, System Design
										</p>
									</div>
									<div className="card bg-dark-300 p-6 shadow-lg transition-transform hover:scale-105">
										<h3 className="text-light-400">Success Rate</h3>
										<p className="mt-2 text-3xl font-bold text-primary-200">
											92%
										</p>
										<p className="text-sm text-light-500">
											Users report improved confidence
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Quick Links to Interview Types */}
						<div className="mt-12 text-center">
							<p className="mb-4 text-light-400">
								Explore Our Interview Types:
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								<Link
									href="/interview?type=technical"
									className="flex items-center gap-2 rounded-full bg-dark-200 px-4 py-2 text-sm text-primary-200 hover:bg-dark-200/80 transition-colors"
								>
									<Code className="h-4 w-4" />
									Technical
								</Link>
								<Link
									href="/interview?type=behavioral"
									className="flex items-center gap-2 rounded-full bg-dark-200 px-4 py-2 text-sm text-primary-200 hover:bg-dark-200/80 transition-colors"
								>
									<Brain className="h-4 w-4" />
									Behavioral
								</Link>
								<Link
									href="/interview?type=system-design"
									className="flex items-center gap-2 rounded-full bg-dark-200 px-4 py-2 text-sm text-primary-200 hover:bg-dark-200/80 transition-colors"
								>
									<Award className="h-4 w-4" />
									System Design
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Performance Chart Section
				{completedInterviews > 0 && (
					<section className="mb-8 mt-8 pt-4">
						<div className="flex justify-between items-center mb-4">
							<h2>Performance Overview</h2>
							<Link
								href="/performance"
								className="text-primary-200 hover:underline flex items-center gap-1"
							>
								View detailed performance
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>
						<div className="card bg-dark-300 p-6">
							<PerformanceChart data={chartData} />
						</div>
					</section>
				)} */}

				{/* Your Interviews Section */}
				<section className="mb-8 mt-8">
					<h2 className="mb-4">Your Interviews</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{hasPastInterviews ? (
							interviews.map((interview) => (
								<InterviewCard
									key={interview.id}
									userId={user.id}
									id={interview.id}
									role={interview.role}
									type={interview.type}
									techstack={interview.techstack}
									createdAt={interview.createdAt}
								/>
							))
						) : (
							<p className="text-light-400 col-span-full">
								You haven't taken any interviews yet.
							</p>
						)}
					</div>
				</section>

				{/* Available Interviews Section */}
				<section className="mb-8">
					<h2 className="mb-4">Available Interviews</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{hasUpcomingInterviews ? (
							allInterviews?.map((interview) => (
								<InterviewCard
									key={interview.id}
									userId={user.id}
									id={interview.id}
									role={interview.role}
									type={interview.type}
									techstack={interview.techstack}
									createdAt={new Date(interview.createdAt)}
								/>
							))
						) : (
							<p className="text-light-400 col-span-full">
								There are no interviews available.
							</p>
						)}
					</div>
				</section>
			</div>

			<Footer />
		</div>
	);
}
