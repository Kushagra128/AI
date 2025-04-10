import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import PerformanceChart from "@/app/components/PerformanceChart";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Footer from "@/app/components/Footer";

interface Interview {
	id: string;
	role: string;
	type: string;
	techstack: string[];
	createdAt: Date | string;
	status?: "available" | "in_progress" | "completed";
	score?: number;
}

interface TypePerformance {
	count: number;
	totalScore: number;
	scores: number[];
}

interface TypeStats {
	type: string;
	averageScore: number;
	interviews: number;
	highestScore: number;
	lowestScore: number;
}

export default async function PerformancePage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/sign-in");
	}

	// Get user interviews
	const userInterviews = await getInterviewsByUserId(user.id);

	// Filter completed interviews
	const completedInterviews = userInterviews.filter(
		(i: Interview) => i.status === "completed"
	);

	// Calculate statistics
	const totalInterviews = userInterviews.length;
	const completedInterviewsCount = completedInterviews.length;
	const averageScore =
		completedInterviewsCount > 0
			? completedInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0) /
			  completedInterviewsCount
			: 0;

	// Prepare chart data
	const chartData = completedInterviews
		.map((i: Interview) => ({
			name: i.type,
			score: i.score || 0,
		}))
		.slice(-5); // Show last 5 completed interviews

	// Group interviews by type for categorical performance analysis
	const performanceByType: Record<string, TypePerformance> = {};
	completedInterviews.forEach((interview: Interview) => {
		if (!performanceByType[interview.type]) {
			performanceByType[interview.type] = {
				count: 0,
				totalScore: 0,
				scores: [],
			};
		}

		performanceByType[interview.type].count++;
		performanceByType[interview.type].totalScore += interview.score || 0;
		performanceByType[interview.type].scores.push(interview.score || 0);
	});

	// Calculate average score by type
	const typePerformance: TypeStats[] = Object.entries(performanceByType).map(
		([type, data]) => ({
			type,
			averageScore: data.count > 0 ? data.totalScore / data.count : 0,
			interviews: data.count,
			highestScore: Math.max(...data.scores),
			lowestScore: Math.min(...data.scores),
		})
	);

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

				<h1 className="mb-6 text-3xl font-semibold text-white">
					Your Performance
				</h1>

				{/* Overview Stats */}
				<div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="card bg-dark-300 p-6">
						<h3 className="text-light-400">Total Interviews</h3>
						<p className="mt-2 text-3xl font-bold text-primary-200">
							{totalInterviews}
						</p>
					</div>
					<div className="card bg-dark-300 p-6">
						<h3 className="text-light-400">Completed Interviews</h3>
						<p className="mt-2 text-3xl font-bold text-primary-200">
							{completedInterviewsCount}
						</p>
					</div>
					<div className="card bg-dark-300 p-6">
						<h3 className="text-light-400">Average Score</h3>
						<p className="mt-2 text-3xl font-bold text-primary-200">
							{averageScore.toFixed(1)}%
						</p>
					</div>
				</div>

				{/* Performance Chart Section */}
				{completedInterviewsCount > 0 ? (
					<div className="mb-10">
						<h2 className="mb-4 text-xl font-semibold text-white">
							Recent Performance
						</h2>
						<div className="card bg-dark-300 p-6">
							<PerformanceChart data={chartData} />
						</div>
					</div>
				) : (
					<div className="mb-10 card bg-dark-300 p-6 text-center">
						<p className="text-light-400">
							You haven't completed any interviews yet. Complete an interview to
							see your performance data.
						</p>
						<Link
							href="/interview"
							className="mt-4 inline-block px-4 py-2 bg-primary-200 text-dark-100 rounded-full font-medium hover:bg-primary-200/90 transition-colors"
						>
							Start an Interview
						</Link>
					</div>
				)}

				{/* Performance by Interview Type */}
				{completedInterviewsCount > 0 && (
					<div className="mb-10">
						<h2 className="mb-4 text-xl font-semibold text-white">
							Performance by Interview Type
						</h2>
						<div className="overflow-x-auto">
							<table className="w-full card bg-dark-300 p-4">
								<thead className="border-b border-dark-400">
									<tr>
										<th className="p-4 text-left text-light-400">
											Interview Type
										</th>
										<th className="p-4 text-left text-light-400">Interviews</th>
										<th className="p-4 text-left text-light-400">Avg Score</th>
										<th className="p-4 text-left text-light-400">Highest</th>
										<th className="p-4 text-left text-light-400">Lowest</th>
									</tr>
								</thead>
								<tbody>
									{typePerformance.map((item) => (
										<tr key={item.type} className="border-b border-dark-400">
											<td className="p-4 text-white">{item.type}</td>
											<td className="p-4 text-light-300">{item.interviews}</td>
											<td className="p-4 text-light-300">
												{item.averageScore.toFixed(1)}%
											</td>
											<td className="p-4 text-light-300">
												{item.highestScore}%
											</td>
											<td className="p-4 text-light-300">
												{item.lowestScore}%
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Improvement Suggestions */}
				<div className="mb-10">
					<h2 className="mb-4 text-xl font-semibold text-white">
						Improvement Suggestions
					</h2>
					<div className="card bg-dark-300 p-6">
						<ul className="space-y-3">
							{completedInterviewsCount > 0 ? (
								<>
									{averageScore < 70 && (
										<li className="flex items-start gap-2">
											<span className="mt-2 h-2 w-2 rounded-full bg-yellow-500" />
											<span className="text-light-300">
												Focus on fundamentals and study core concepts more
												thoroughly
											</span>
										</li>
									)}
									{typePerformance.some((type) => type.averageScore < 65) && (
										<li className="flex items-start gap-2">
											<span className="mt-2 h-2 w-2 rounded-full bg-yellow-500" />
											<span className="text-light-300">
												Improve your performance in{" "}
												{
													typePerformance.find((type) => type.averageScore < 65)
														?.type
												}{" "}
												interviews
											</span>
										</li>
									)}
									<li className="flex items-start gap-2">
										<span className="mt-2 h-2 w-2 rounded-full bg-green-500" />
										<span className="text-light-300">
											Continue to practice regularly to build consistency
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="mt-2 h-2 w-2 rounded-full bg-green-500" />
										<span className="text-light-300">
											Try different interview types to broaden your skills
										</span>
									</li>
								</>
							) : (
								<li className="flex items-start gap-2">
									<span className="mt-2 h-2 w-2 rounded-full bg-yellow-500" />
									<span className="text-light-300">
										Complete your first interview to receive personalized
										improvement suggestions
									</span>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}
