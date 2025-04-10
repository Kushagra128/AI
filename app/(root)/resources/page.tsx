import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import InterviewPreparation from "@/app/components/InterviewPreparation";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import Footer from "@/app/components/Footer";

const ResourcesPage = async () => {
	const user = await getCurrentUser();
	if (!user) redirect("/sign-in");

	const interviews = await getInterviewsByUserId(user.id);
	const totalTarget = 5; // Target number of interviews per type

	// Calculate progress dynamically
	const technicalCount = interviews.filter(
		(i) => i.type.toLowerCase() === "technical"
	).length;
	const behavioralCount = interviews.filter(
		(i) => i.type.toLowerCase() === "behavioral"
	).length;
	const systemDesignCount = interviews.filter(
		(i) => i.type.toLowerCase() === "system-design"
	).length;

	const progress = [
		{
			name: "Technical Interviews",
			count: technicalCount,
			percentage: (technicalCount / totalTarget) * 100,
		},
		{
			name: "Behavioral Interviews",
			count: behavioralCount,
			percentage: (behavioralCount / totalTarget) * 100,
		},
		{
			name: "System Design Interviews",
			count: systemDesignCount,
			percentage: (systemDesignCount / totalTarget) * 100,
		},
	];

	// Dynamic next steps based on progress
	const nextSteps = [];
	if (systemDesignCount < totalTarget)
		nextSteps.push("Complete a System Design interview");
	if (technicalCount > 0)
		nextSteps.push("Review your Technical interview feedback");
	if (behavioralCount < totalTarget)
		nextSteps.push("Practice more Behavioral interviews");
	if (nextSteps.length === 0) nextSteps.push("Keep up the great work!");

	return (
		<div className="min-h-screen bg-dark-100 py-12">
			<div className="container mx-auto px-4">
				{/* Header */}
				<h1 className="mb-10 text-3xl font-semibold text-white md:text-4xl">
					Resources & Preparation
				</h1>

				{/* Main Layout */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
					{/* Interview Preparation */}
					<div className="lg:col-span-8">
						<InterviewPreparation />
					</div>

					{/* Progress Sidebar */}
					<div className="lg:col-span-4">
						<div className="rounded-lg border border-dark-300 bg-dark-200 p-6 shadow-md">
							<h2 className="mb-6 text-xl font-semibold text-white">
								Your Progress
							</h2>
							<div className="space-y-6">
								{progress.map((item) => (
									<div key={item.name}>
										<div className="flex items-center justify-between text-sm">
											<span className="text-light-300">{item.name}</span>
											<span className="text-primary-200">
												{item.count}/{totalTarget}
											</span>
										</div>
										<div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-dark-400">
											<div
												className="h-full rounded-full bg-primary-200 transition-all"
												style={{ width: `${Math.min(item.percentage, 100)}%` }}
											/>
										</div>
									</div>
								))}
							</div>

							{/* Next Steps */}
							<div className="mt-6 border-t border-dark-300 pt-6">
								<h3 className="mb-3 text-base font-medium text-white">
									Next Steps
								</h3>
								<ul className="space-y-3 text-sm text-light-300">
									{nextSteps.map((step, index) => (
										<li key={index} className="flex items-start gap-2">
											<span className="mt-1 h-2 w-2 rounded-full bg-primary-200" />
											{step}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default ResourcesPage;
