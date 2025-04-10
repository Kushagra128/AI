import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import Image from "next/image";
import { User, Calendar, Clock, Star } from "lucide-react";

interface Interview {
	id: string;
	type: string;
	status: "available" | "in_progress" | "completed";
	createdAt: Date;
	duration: number;
	score?: number;
	feedback?: string;
}

export default async function ProfilePage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect("/sign-in");
	}

	const interviews: Interview[] = (await getInterviewsByUserId(user.id)) || [];

	return (
		<div className="root-layout">
			<div className="container mx-auto px-4 py-8">
				{/* Profile Header */}
				<div className="card p-6 mb-8">
					<div className="flex items-center space-x-4">
						{user.image ? (
							<Image
								src={user.image}
								alt={`${user.name || "User"} profile`}
								width={80}
								height={80}
								className="rounded-full object-cover"
							/>
						) : (
							<div className="flex-center h-20 w-20 rounded-full bg-dark-200">
								<User className="h-10 w-10 text-light-400" />
							</div>
						)}
						<div>
							<h1 className="text-primary-200">
								{user.name || "Unnamed User"}
							</h1>
							<p className="text-light-400">{user.email}</p>
						</div>
					</div>
				</div>

				{/* Interview History */}
				<div className="card p-6">
					<h2 className="mb-6">Interview History</h2>
					<div className="space-y-4">
						{interviews.length > 0 ? (
							interviews.map((interview) => (
								<div
									key={interview.id}
									className="dark-gradient rounded-lg p-4 border border-light-800"
								>
									<div className="flex items-center justify-between">
										<h3 className="text-primary-200">{interview.type}</h3>
										<span
											className={`
                        rounded-full px-3 py-1 text-sm font-medium
                        ${
													interview.status === "available" &&
													"bg-success-100/20 text-success-100"
												}
                        ${
													interview.status === "in_progress" &&
													"bg-yellow-500/20 text-yellow-300"
												}
                        ${
													interview.status === "completed" &&
													"bg-primary-200/20 text-primary-200"
												}
                      `}
										>
											{interview.status}
										</span>
									</div>
									<div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-light-400">
										<div className="flex items-center">
											<Calendar className="mr-1 h-4 w-4" />
											{formatDate(interview.createdAt)}
										</div>
										<div className="flex items-center">
											<Clock className="mr-1 h-4 w-4" />
											{interview.duration} minutes
										</div>
										{interview.score && (
											<div className="flex items-center">
												<Star className="mr-1 h-4 w-4 text-yellow-300" />
												{interview.score}/100
											</div>
										)}
									</div>
									{interview.feedback && (
										<div className="mt-4 rounded-md bg-dark-200 p-3">
											<h4 className="mb-2 text-primary-200">Feedback</h4>
											<p className="text-sm text-light-100">
												{interview.feedback}
											</p>
										</div>
									)}
								</div>
							))
						) : (
							<p className="text-center text-light-400">
								No interviews taken yet.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
