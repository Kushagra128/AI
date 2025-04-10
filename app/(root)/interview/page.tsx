import Agent from "@/app/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Page = async () => {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/sign-in");
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h3 className="text-2xl font-bold mb-6 text-center">
				Interview Generation
			</h3>
			<p className="text-light-100 mb-8 text-center">
				Our AI will help you generate a custom interview based on your profile
				and preferences.
			</p>

			<div className="max-w-3xl mx-auto">
				<Agent
					userName={user.name || "User"}
					userId={user.id}
					type="generate"
				/>
			</div>
		</div>
	);
};

export default Page;
