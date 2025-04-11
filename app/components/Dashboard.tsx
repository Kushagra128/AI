"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

interface DashboardProps {
	userId: string;
}

interface Stats {
	totalInterviews: number;
	averageScore: number;
	categoryAverages: Record<string, number>;
	improvementAreas: string[];
	progress: { date: string; score: number }[];
	recentInterviews: {
		id: string;
		role: string;
		createdAt: string;
		score: number;
		coverImage?: string;
	}[];
}

const Dashboard = ({ userId }: DashboardProps) => {
	const [stats, setStats] = useState<Stats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch(`/api/analytics?userId=${userId}`);
				const data = await response.json();
				if (data.success) {
					setStats(data.data);
				} else {
					console.error("Failed to fetch stats:", data.message);
				}
			} catch (error) {
				console.error("Error fetching stats:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [userId]);

	if (loading) {
		return (
			<div className="flex-center h-screen text-light-100">Loading...</div>
		);
	}

	if (!stats) {
		return (
			<div className="flex-center h-screen text-light-100">
				No data available
			</div>
		);
	}

	const chartData = {
		labels:
			stats.progress.map((p) => new Date(p.date).toLocaleDateString()) || [],
		datasets: [
			{
				label: "Interview Score",
				data: stats.progress.map((p) => p.score) || [],
				borderColor: "var(--chart-1)", // Uses your theme's chart color
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				tension: 0.1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: { position: "top" as const },
			title: {
				display: true,
				text: "Interview Performance Trend",
				color: "var(--light-100)",
			},
			tooltip: { backgroundColor: "var(--dark-200)" },
		},
		scales: {
			x: { ticks: { color: "var(--light-100)" } },
			y: { ticks: { color: "var(--light-100)" } },
		},
	};

	return (
		<div className="root-layout">
			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div className="card p-6">
					<h3>Total Interviews</h3>
					<p className="text-2xl font-bold text-primary-200">
						{stats.totalInterviews}
					</p>
				</div>
				<div className="card p-6">
					<h3>Average Score</h3>
					<p className="text-2xl font-bold text-primary-200">
						{stats.averageScore.toFixed(1)}%
					</p>
				</div>
				<div className="card p-6">
					<h3>Best Category</h3>
					<p className="text-2xl font-bold text-primary-200">
						{Object.entries(stats.categoryAverages).sort(
							([, a], [, b]) => b - a
						)[0]?.[0] || "N/A"}
					</p>
				</div>
				<div className="card p-6">
					<h3>Areas to Improve</h3>
					<p className="text-2xl font-bold text-primary-200">
						{stats.improvementAreas.length}
					</p>
				</div>
			</div>

			{/* Progress Chart */}
			<div className="card p-6 mb-8">
				<h2 className="mb-4">Progress Over Time</h2>
				<Line data={chartData} options={chartOptions} />
			</div>

			{/* Category Breakdown and Recent Interviews */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="card p-6">
					<h2 className="mb-4">Category Breakdown</h2>
					{Object.entries(stats.categoryAverages).map(([category, score]) => (
						<div key={category} className="flex items-center gap-4 mb-2">
							<span className="w-1/3 text-light-100">{category}</span>
							<div className="progress w-1/2">
								<div
									className="bg-light-100 h-full rounded-full"
									style={{ width: `${score}%` }}
								/>
							</div>
							<span className="w-1/6 text-light-100 text-right">
								{score.toFixed(1)}%
							</span>
						</div>
					))}
				</div>

				<div className="card p-6">
					<h2 className="mb-4">Recent Interviews</h2>
					{stats.recentInterviews.map((interview) => (
						<Link
							key={interview.id}
							href={`/interview/${interview.id}`}
							className="flex items-center justify-between p-4 dark-gradient rounded-lg mb-2 hover:bg-dark-200/80 transition-colors"
						>
							<div className="flex items-center gap-2">
								<Image
									src={interview.coverImage || "/default-cover.png"}
									alt={`${interview.role} cover`}
									width={40}
									height={40}
									className="rounded-full"
								/>
								<div>
									<h3 className="font-semibold text-primary-200">
										{interview.role}
									</h3>
									<p className="text-sm text-light-400">
										{new Date(interview.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
							<div className="text-primary-200 font-bold">
								{interview.score}%
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
