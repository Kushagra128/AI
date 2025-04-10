import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: ReactNode }) => {
	const isUserAuthenticated = await isAuthenticated();
	if (!isUserAuthenticated) redirect("/sign-in");

	return <div className="root-layout">{children}</div>;
};

export default Layout;
