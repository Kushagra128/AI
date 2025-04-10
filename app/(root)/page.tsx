import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

import { Button } from "@/components/ui/button";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
	getInterviewsByUserId,
	getLatestInterviews,
} from "@/lib/actions/general.action";
import InterviewCard from "../components/InterviewCard";

async function Home() {
	const user = await getCurrentUser();

	const [userInterviews, allInterview] = await Promise.all([
		getInterviewsByUserId(user?.id!),
		getLatestInterviews({ userId: user?.id! }),
	]);

	const hasPastInterviews = userInterviews?.length! > 0;
	const hasUpcomingInterviews = allInterview?.length! > 0;

	return (
		<>
			<section className="card-cta">
				<div className="flex flex-col gap-6 max-w-lg">
					<h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
					<p className="text-lg">
						Practice real interview questions & get instant feedback
					</p>

					<Button asChild className="btn-primary max-sm:w-full">
						<Link href="/interview">Start an Interview</Link>
					</Button>
				</div>

				<Image
					src="/robot.png"
					alt="robo-dude"
					width={400}
					height={400}
					className="max-sm:hidden"
				/>
			</section>

			<section className="flex flex-col gap-6 mt-8">
				<h2>Your Interviews</h2>

				<div className="interviews-section">
					{hasPastInterviews ? (
						userInterviews?.map((interview) => (
							<InterviewCard
								key={interview.id}
								userId={user?.id}
								id={interview.id}
								role={interview.role}
								type={interview.type}
								techstack={interview.techstack}
								createdAt={new Date(interview.createdAt)}
							/>
						))
					) : (
						<p>You haven&apos;t taken any interviews yet</p>
					)}
				</div>
			</section>

			<section className="flex flex-col gap-6 mt-8">
				<h2>Take Interviews</h2>

				<div className="interviews-section">
					{hasUpcomingInterviews ? (
						allInterview?.map((interview) => (
							<InterviewCard
								key={interview.id}
								userId={user?.id}
								id={interview.id}
								role={interview.role}
								type={interview.type}
								techstack={interview.techstack}
								createdAt={new Date(interview.createdAt)}
							/>
						))
					) : (
						<p>There are no interviews available</p>
					)}
				</div>
			</section>
			<hr className="border-gray-700" />
			<footer className="text-white px-4">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						{/* Logo and Brand */}
						<Link href="/" className="flex items-center gap-2">
							<Image
								src="/logo.svg"
								alt="MockMate Logo"
								width={38}
								height={32}
								className="w-9 h-8"
							/>
							<h2 className="text-xl font-semibold tracking-tight">
								SENS<span className="text-blue-400">AI</span>
							</h2>
						</Link>

						{/* Powered By */}
						<p className="text-sm text-gray-400">Powered by UI22CS41</p>

						{/* Social Links */}
						<div className="flex gap-6">
							<Link
								href="https://www.linkedin.com"
								target="_blank"
								aria-label="LinkedIn"
								className="transition-colors duration-200"
							>
								<FaLinkedin className="text-gray-300 hover:text-blue-500 text-xl" />
							</Link>
							<Link
								href="https://www.facebook.com"
								target="_blank"
								aria-label="Facebook"
								className="transition-colors duration-200"
							>
								<FaFacebook className="text-gray-300 hover:text-blue-600 text-xl" />
							</Link>
							<Link
								href="https://www.instagram.com"
								target="_blank"
								aria-label="Instagram"
								className="transition-colors duration-200"
							>
								<FaInstagram className="text-gray-300 hover:text-pink-500 text-xl" />
							</Link>
						</div>
					</div>
					<div className="text-center text-xs text-gray-500 mt-2">
						© {new Date().getFullYear()} SENSAI. All rights reserved.
					</div>
				</div>
			</footer>
		</>
	);
}

export default Home;
