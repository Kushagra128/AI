"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "next-auth";
import ProfileDropdown from "./ProfileDropdown";

interface NavbarClientProps {
	user: User | null;
}

const NavbarClient = ({ user }: NavbarClientProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="fixed top-0 z-50 w-full border-b border-border bg-background dark:bg-dark-100 dark:border-light-800">
			<div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
				{/* Logo and Brand */}
				<Link href="/" className="flex items-center space-x-3">
					<Image
						src="/logo.svg"
						alt="SensAI Logo"
						width={38}
						height={32}
						priority
					/>
					<span className="self-center whitespace-nowrap text-xl font-semibold text-white">
						SENS<span className="text-blue-300"> AI</span>
					</span>
				</Link>

				{/* Mobile Menu Toggle */}
				<button
					className="md:hidden p-2 rounded-lg text-light-100 hover:bg-dark-200 focus:outline-none"
					onClick={() => setIsOpen(!isOpen)}
					aria-label="Toggle navigation menu"
					aria-expanded={isOpen}
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
						/>
					</svg>
				</button>

				{/* Navigation Links */}
				<div
					className={`w-full md:w-auto md:flex items-center space-y-2 md:space-y-0 md:space-x-4 transition-all duration-300 ${
						isOpen ? "flex flex-col mt-4" : "hidden md:flex"
					}`}
				>
					{user ? (
						<>
							<Link
								href="/dashboard"
								className="bg-blue-950 hover:bg-blue-900 rounded-full text-white px-4 py-2 text-sm font-medium transition-colors duration-150 items-center"
							>
								Dashboard
							</Link>
							<Link
								href="/resources"
								className="bg-blue-950 hover:bg-blue-900 rounded-full text-white px-4 py-2 text-sm font-medium transition-colors duration-150 items-center "
							>
								Resources
							</Link>
							<p className="text-white">{user.name}</p>
							<ProfileDropdown user={user} />
						</>
					) : (
						<>
							<Link
								href="/sign-in"
								className="btn-secondary px-4 py-2 text-sm font-medium transition-colors duration-150"
							>
								Sign In
							</Link>
							<Link
								href="/sign-up"
								className="btn-primary px-4 py-2 text-sm font-medium transition-colors duration-150"
							>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default NavbarClient;
