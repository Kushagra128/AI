"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";

interface ProfileDropdownProps {
	user: User;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSignOut = async () => {
		try {
			// First, sign out from NextAuth
			await signOut({ redirect: false });

			// Then sign out from our custom Firebase auth
			await fetch("/api/auth/logout", { method: "POST" });

			// Finally, redirect to sign-in page
			router.push("/sign-in");
		} catch (error) {
			console.error("Sign out error:", error);
			router.push("/sign-in");
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Toggle Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center space-x-2 focus:outline-none rounded-full p-1 hover:bg-dark-200 transition-colors"
				aria-label="Toggle profile menu"
				aria-expanded={isOpen}
			>
				<div className="relative w-8 h-8 rounded-full overflow-hidden">
					<Image
						src={user.image || "/profile.svg"}
						alt={`${user.name || "User"} avatar`}
						fill
						className="object-cover"
					/>
				</div>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="text-gray-400 absolute right-0 mt-2 w-48 dark-gradient rounded-md shadow-lg py-1 z-50 border border-light-800">
					<div className="px-4 py-2 border-b border-light-800">
						<p className="text-sm font-medium">{user.name || "User"}</p>
						<p className="text-xs text-gray-400 truncate">{user.email}</p>
					</div>
					<Link
						href="/profile"
						className="block px-4 py-2 text-sm hover:bg-dark-200/80 transition-colors"
					>
						Profile
					</Link>
					<Link
						href="/dashboard"
						className="block px-4 py-2 text-sm hover:bg-dark-200/80 transition-colors"
					>
						Dashboard
					</Link>
					<button
						onClick={handleSignOut}
						className="block w-full text-left px-4 py-2 text-sm hover:bg-dark-200/80 transition-colors cursor-pointer"
					>
						Sign Out
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfileDropdown;
