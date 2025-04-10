"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, Bookmark, ExternalLink } from "lucide-react";

interface Resource {
	title: string;
	description: string;
	url: string;
	type: "article" | "video" | "book" | "course";
	category: string;
}

interface CategorySection {
	title: string;
	description: string;
	resources: Resource[];
}

const InterviewPreparation = () => {
	const [expandedSections, setExpandedSections] = useState<string[]>([
		"technical",
	]);

	const toggleSection = (section: string) => {
		setExpandedSections((prev) =>
			prev.includes(section)
				? prev.filter((s) => s !== section)
				: [...prev, section]
		);
	};

	const isExpanded = (section: string) => expandedSections.includes(section);

	const categories: CategorySection[] = [
		{
			title: "Technical Interview Preparation",
			description:
				"Resources to help you prepare for technical coding interviews and algorithm challenges.",
			resources: [
				{
					title: "Data Structures & Algorithms Fundamentals",
					description:
						"A comprehensive guide to essential data structures and algorithms for technical interviews.",
					url: "https://www.example.com/dsa-guide",
					type: "article",
					category: "technical",
				},
				{
					title: "System Design Interview Guide",
					description:
						"Learn how to approach and solve system design questions in interviews.",
					url: "https://www.example.com/system-design",
					type: "article",
					category: "technical",
				},
				{
					title: "Solving LeetCode Problems",
					description:
						"A structured approach to solving LeetCode problems efficiently.",
					url: "https://www.example.com/leetcode-strategy",
					type: "video",
					category: "technical",
				},
			],
		},
		{
			title: "Behavioral Interview Preparation",
			description:
				"Resources to help you prepare for behavioral and situational interview questions.",
			resources: [
				{
					title: "STAR Method for Behavioral Questions",
					description:
						"Learn the Situation, Task, Action, Result method for answering behavioral questions.",
					url: "https://www.example.com/star-method",
					type: "article",
					category: "behavioral",
				},
				{
					title: "Common Behavioral Interview Questions",
					description:
						"Practice with common behavioral questions asked in tech interviews.",
					url: "https://www.example.com/behavioral-questions",
					type: "article",
					category: "behavioral",
				},
				{
					title: "Handling Difficult Behavioral Questions",
					description:
						"Strategies for tackling challenging behavioral questions.",
					url: "https://www.example.com/difficult-behavioral",
					type: "video",
					category: "behavioral",
				},
			],
		},
		{
			title: "Interview Best Practices",
			description:
				"General tips and best practices for making a great impression during interviews.",
			resources: [
				{
					title: "Interview Preparation Checklist",
					description:
						"A comprehensive checklist to ensure you're fully prepared for your interview.",
					url: "https://www.example.com/checklist",
					type: "article",
					category: "general",
				},
				{
					title: "Mock Interview Strategies",
					description:
						"How to make the most of mock interviews to improve your performance.",
					url: "https://www.example.com/mock-interviews",
					type: "article",
					category: "general",
				},
				{
					title: "Body Language and Communication Tips",
					description:
						"Improve your non-verbal communication during interviews.",
					url: "https://www.example.com/communication",
					type: "video",
					category: "general",
				},
			],
		},
	];

	return (
		<div className="w-full">
			<h2 className="text-2xl font-bold mb-6">
				Interview Preparation Resources
			</h2>
			<p className="text-light-100 mb-8">
				Use these resources to prepare for your upcoming interviews. Click on
				each section to expand and explore relevant materials.
			</p>

			<div className="space-y-6">
				{categories.map((category, index) => (
					<div
						key={index}
						className="border border-light-800 rounded-lg overflow-hidden"
					>
						<button
							onClick={() => toggleSection(category.title)}
							className="w-full flex items-center justify-between p-4 bg-dark-200 hover:bg-dark-300 transition-colors"
						>
							<h3 className="text-lg font-semibold">{category.title}</h3>
							{isExpanded(category.title) ? (
								<ChevronUp className="h-5 w-5 text-light-100" />
							) : (
								<ChevronDown className="h-5 w-5 text-light-100" />
							)}
						</button>

						{isExpanded(category.title) && (
							<div className="p-4 bg-dark-300">
								<p className="text-light-100 mb-4">{category.description}</p>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{category.resources.map((resource, resourceIndex) => (
										<div
											key={resourceIndex}
											className="bg-dark-200 p-4 rounded-lg border border-light-800 hover:border-primary-200 transition-colors"
										>
											<div className="flex justify-between items-start mb-2">
												<span
													className={`px-2 py-1 rounded text-xs ${
														resource.type === "article"
															? "bg-blue-900 text-blue-200"
															: resource.type === "video"
															? "bg-red-900 text-red-200"
															: resource.type === "book"
															? "bg-green-900 text-green-200"
															: "bg-purple-900 text-purple-200"
													}`}
												>
													{resource.type.toUpperCase()}
												</span>
												<button
													className="text-light-100 hover:text-primary-200"
													aria-label="Save resource"
												>
													<Bookmark className="h-4 w-4" />
												</button>
											</div>
											<h4 className="font-medium mb-2">{resource.title}</h4>
											<p className="text-light-100 text-sm mb-4">
												{resource.description}
											</p>
											<Link
												href={resource.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary-200 text-sm flex items-center hover:underline"
											>
												View Resource
												<ExternalLink className="h-3 w-3 ml-1" />
											</Link>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			<div className="mt-8 p-6 bg-dark-200 rounded-lg border border-light-800">
				<h3 className="text-xl font-bold mb-2">Pro Tip</h3>
				<div className="flex items-start gap-4">
					<div className="bg-primary-100 rounded-full p-3">
						<Image
							src="/light-bulb.svg"
							alt="Tip"
							width={24}
							height={24}
							className="h-6 w-6"
						/>
					</div>
					<div>
						<p className="text-light-100">
							Practice makes perfect! Use SensAI's interview simulator regularly
							to improve your skills. We recommend completing at least 3 mock
							interviews before your actual interview.
						</p>
						<Link
							href="/interview"
							className="mt-4 inline-block px-4 py-2 bg-primary-200 text-dark-100 rounded-full font-medium hover:bg-primary-200/90 transition-colors"
						>
							Start a Practice Interview
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InterviewPreparation;
