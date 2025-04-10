"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface ChartData {
	name: string;
	score: number;
}

interface PerformanceChartProps {
	data: ChartData[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
	return (
		<div className="h-80">
			{data.length > 0 ? (
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={data}>
						<CartesianGrid stroke="#1e2132" strokeDasharray="3 3" />
						<XAxis dataKey="name" stroke="#404258" />
						<YAxis domain={[0, 100]} stroke="#404258" />
						<Tooltip
							contentStyle={{
								backgroundColor: "#1f212b",
								border: "1px solid #1e2132",
								borderRadius: "0.625rem",
								color: "#404258",
							}}
						/>
						<Bar dataKey="score" fill="#6b728e" />
					</BarChart>
				</ResponsiveContainer>
			) : (
				<div className="flex-center h-full text-light-400">
					<p>No interview data available yet.</p>
				</div>
			)}
		</div>
	);
};

export default PerformanceChart;
