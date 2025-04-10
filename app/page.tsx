import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { ArrowRight, Code, Mic, Brain, Award } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import Footer from "./components/Footer";

export default async function HomePage() {
	const user = await getCurrentUser();

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<section className="dark-gradient py-20">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="py-12 text-white text-4xl font-bold">
							Master Your Interview Skills with{" "}
							<span className="text-blue-300"> AI</span>
						</h1>
						<p className="mb-8 text-lg text-gray-400 sm:text-xl">
							Practice interviews with our AI-powered platform and get instant
							feedback to improve your performance.
						</p>
						<div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
							<Link
								href={user ? "/dashboard" : "/sign-in"}
								className="btn-primary flex items-center px-6 py-3 text-lg font-semibold text-black"
							>
								{user ? "Go to Dashboard" : "Get Started"}
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
							<Link
								href="/resources"
								className="btn-secondary flex items-center px-6 py-3 text-lg font-semibold text-white"
							>
								Learn More
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="root-layout py-16">
				<div className="container mx-auto px-4">
					<h2 className="mb-12 text-center text-white">Why Choose SensAI?</h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
						<div className="card p-6 text-center font-semibold">
							<div className="mx-auto mb-4 flex-center h-16 w-16 rounded-full bg-dark-200">
								<Mic className="h-8 w-8 text-primary-200" />
							</div>
							<h3 className="text-white mb-2">Realistic Interviews</h3>
							<hr />
							<p className="text-white mt-2">
								Practice with AI interviewers that simulate real-world
								scenarios.
							</p>
						</div>
						<div className="card p-6 text-center font-semibold">
							<div className="mx-auto mb-4 flex-center h-16 w-16 rounded-full bg-dark-200">
								<Code className="h-8 w-8 text-success-100" />
							</div>
							<h3 className="text-white mb-2">Code Challenges</h3>
							<hr />
							<p className="text-white mt-2">
								Test your coding skills with real programming challenges.
							</p>
						</div>
						<div className="card p-6 text-center font-semibold">
							<div className="mx-auto mb-4 flex-center h-16 w-16 rounded-full bg-dark-200">
								<Brain className="h-8 w-8 text-purple-300" />
							</div>
							<h3 className="text-white mb-2">AI-Powered Feedback</h3>
							<hr />
							<p className="text-white mt-2">
								Get detailed feedback on your performance to improve.
							</p>
						</div>
						<div className="card p-6 text-center font-semibold">
							<div className="mx-auto mb-4 flex-center h-16 w-16 rounded-full bg-dark-200">
								<Award className="h-8 w-8 text-yellow-300" />
							</div>
							<h3 className="text-white mb-2">Track Progress</h3>
							<hr />
							<p className="text-white mt-2">
								Monitor your improvement over time with detailed analytics.
							</p>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
