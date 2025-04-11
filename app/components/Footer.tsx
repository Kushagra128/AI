"use client";

import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
	return (
		<>
			<hr className="border-gray-700 mt-8" />
			<footer className="text-white px-4 py-8">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						{/* Logo and Brand */}
						<Link href="/" className="flex items-center gap-2">
							<Image
								src="/logo.svg"
								alt="SENSAI Logo"
								width={38}
								height={32}
								className="w-9 h-8"
							/>
							<h2 className="text-xl font-semibold tracking-tight">
								SENS<span className="text-blue-400">AI</span>
							</h2>
						</Link>

						{/* Powered By */}
						<p className="text-sm text-gray-400">Powered by UI02, UI41, UI44</p>

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
};

export default Footer;
