"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
	return (
		<button
			onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
			className="btn-primary group relative flex w-full justify-center items-center px-4 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 focus:ring-offset-dark-100"
		>
			<span className="absolute inset-y-0 left-0 flex items-center pl-3">
				<svg
					className="h-5 w-5 text-dark-100 group-hover:text-dark-100/80"
					aria-hidden="true"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
				</svg>
			</span>
			Sign in with Google
		</button>
	);
}
