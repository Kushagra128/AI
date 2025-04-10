"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

import FormField from "./FormField";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { auth } from "@/firebase/client";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) =>
	z.object({
		name:
			type === "sign-up"
				? z.string().min(3, "Name must be at least 3 characters")
				: z.string().optional(),
		email: z.string().email("Invalid email address"),
		password: z.string().min(3, "Password must be at least 3 characters"),
	});

const AuthForm = ({ type }: { type: FormType }) => {
	const router = useRouter();
	const isSignIn = type === "sign-in";

	const formSchema = authFormSchema(type);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			if (type === "sign-up") {
				const { name, email, password } = data;
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				const result = await signUp({
					uid: userCredential.user.uid,
					name: name!, // Safe due to schema validation
					email,
					password,
				});

				if (!result.success) {
					toast.error(result.message);
					return;
				}

				toast.success("Account created successfully. Please sign in.");
				router.push("/sign-in");
			} else {
				const { email, password } = data;
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				const idToken = await userCredential.user.getIdToken();

				if (!idToken) {
					toast.error("Sign-in failed. Please try again.");
					return;
				}

				await signIn({ email, idToken });
				toast.success("Signed in successfully.");
				router.push("/");
			}
		} catch (error: any) {
			console.error("Authentication error:", error);
			toast.error(error.message || "An error occurred during authentication.");
		}
	};

	return (
		<div className="card-border lg:min-w-[566px]">
			<div className="card flex flex-col gap-6 py-14 px-10">
				{/* Logo and Title */}
				<div className="flex flex-row gap-2 justify-center">
					<Image
						src="/logo.svg"
						alt="SensAI Logo"
						height={32}
						width={38}
						priority
					/>
					<h2 className="text-primary-100">
						SENS<span className="text-primary-200">AI</span>
					</h2>
				</div>

				<h3 className="text-center">
					Practice job interviews with{" "}
					<span className="text-primary-200">AI</span>
				</h3>

				{/* Form */}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="form space-y-6 mt-4"
					>
						{!isSignIn && (
							<FormField
								control={form.control}
								name="name"
								label="Name"
								placeholder="Your Name"
								type="text"
							/>
						)}
						<FormField
							control={form.control}
							name="email"
							label="Email"
							placeholder="Your email address"
							type="email"
						/>
						<FormField
							control={form.control}
							name="password"
							label="Password"
							placeholder="Enter your password"
							type="password"
						/>
						<Button
							className="btn"
							type="submit"
							disabled={form.formState.isSubmitting}
						>
							{isSignIn ? "Sign In" : "Create an Account"}
						</Button>
					</form>
				</Form>

				{/* Footer Link */}
				<p className="text-center">
					{isSignIn ? "No account yet?" : "Have an account already?"}{" "}
					<Link
						href={isSignIn ? "/sign-up" : "/sign-in"}
						className="font-bold text-primary-200 ml-1"
					>
						{isSignIn ? "Sign Up" : "Sign In"}
					</Link>
				</p>
			</div>
		</div>
	);
};

export default AuthForm;
