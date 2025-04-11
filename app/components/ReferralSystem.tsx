"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ReferralStats {
	totalReferrals: number;
	activeReferrals: number;
	rewardsEarned: number;
	referralCode: string;
}

interface ReferralHistory {
	id: string;
	referredUser: string;
	date: string;
	status: "pending" | "active" | "completed";
	reward: number;
}

const ReferralSystem = ({ userId }: { userId: string }) => {
	const [stats, setStats] = useState<ReferralStats | null>(null);
	const [history, setHistory] = useState<ReferralHistory[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchReferralData = async () => {
			try {
				const [statsResponse, historyResponse] = await Promise.all([
					fetch(`/api/referrals/stats?userId=${userId}`),
					fetch(`/api/referrals/history?userId=${userId}`),
				]);

				const [statsData, historyData] = await Promise.all([
					statsResponse.json(),
					historyResponse.json(),
				]);

				if (statsData.success) {
					setStats(statsData.data);
				} else {
					console.error("Stats fetch failed:", statsData.message);
				}

				if (historyData.success) {
					setHistory(historyData.data);
				} else {
					console.error("History fetch failed:", historyData.message);
				}
			} catch (error) {
				console.error("Error fetching referral data:", error);
				toast.error("Failed to load referral data");
			} finally {
				setLoading(false);
			}
		};

		fetchReferralData();
	}, [userId]);

	const copyReferralCode = async () => {
		if (!stats?.referralCode) return;
		try {
			await navigator.clipboard.writeText(stats.referralCode);
			toast.success("Referral code copied to clipboard!");
		} catch (error) {
			console.error("Copy failed:", error);
			toast.error("Failed to copy referral code");
		}
	};

	const shareReferral = async () => {
		if (!stats?.referralCode) return;
		const shareData = {
			title: "Join me on SensAI",
			text: "Practice interviews with AI and improve your skills!",
			url: `${window.location.origin}/signup?ref=${stats.referralCode}`,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				await navigator.clipboard.writeText(shareData.url);
				toast.success("Referral link copied to clipboard!");
			}
		} catch (error) {
			console.error("Share failed:", error);
			toast.error("Failed to share referral link");
		}
	};

	if (loading) {
		return (
			<div className="flex-center h-screen text-light-100">
				Loading referral data...
			</div>
		);
	}

	return (
		<div className="root-layout">
			{/* Referral Stats */}
			<div className="flex flex-col gap-8">
				<h2>Your Referral Program</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="card p-6">
						<h3>Total Referrals</h3>
						<p className="text-2xl font-bold text-primary-200">
							{stats?.totalReferrals ?? 0}
						</p>
					</div>
					<div className="card p-6">
						<h3>Active Referrals</h3>
						ensor
						<p className="text-2xl font-bold text-primary-200">
							{stats?.activeReferrals ?? 0}
						</p>
					</div>
					<div className="card p-6">
						<h3>Rewards Earned</h3>
						<p className="text-2xl font-bold text-primary-200">
							${stats?.rewardsEarned ?? 0}
						</p>
					</div>
				</div>

				{/* Referral Code */}
				<div className="card p-6">
					<h3 className="mb-4">Your Referral Code</h3>
					<div className="flex flex-col sm:flex-row items-center gap-4">
						<code className="bg-dark-200 text-light-100 px-4 py-2 rounded-full w-full sm:w-auto text-center">
							{stats?.referralCode || "N/A"}
						</code>
						<button
							onClick={copyReferralCode}
							className="btn-secondary w-full sm:w-auto"
						>
							Copy Code
						</button>
						<button
							onClick={shareReferral}
							className="btn-primary w-full sm:w-auto"
						>
							Share
						</button>
					</div>
				</div>

				{/* Referral History */}
				<div className="card p-6">
					<h3 className="mb-4">Referral History</h3>
					{history.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full text-light-100">
								<thead>
									<tr className="text-left text-light-400">
										<th className="p-2">Referred User</th>
										<th className="p-2">Date</th>
										<th className="p-2">Status</th>
										<th className="p-2 text-right">Reward</th>
									</tr>
								</thead>
								<tbody>
									{history.map((referral) => (
										<tr key={referral.id} className="border-t border-light-800">
											<td className="p-2">{referral.referredUser}</td>
											<td className="p-2">
												{new Date(referral.date).toLocaleDateString()}
											</td>
											<td className="p-2">
												<span
													className={`
                            inline-block px-2 py-1 rounded-full text-xs font-semibold
                            ${
															referral.status === "pending" &&
															"bg-yellow-500/20 text-yellow-300"
														}
                            ${
															referral.status === "active" &&
															"bg-success-100/20 text-success-100"
														}
                            ${
															referral.status === "completed" &&
															"bg-primary-200/20 text-primary-200"
														}
                          `}
												>
													{referral.status}
												</span>
											</td>
											<td className="p-2 text-right">${referral.reward}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p className="text-light-400">No referral history yet.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ReferralSystem;
