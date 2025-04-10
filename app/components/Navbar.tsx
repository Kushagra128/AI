import { getCurrentUser } from "@/lib/actions/auth.action";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
	const user = await getCurrentUser();

	return <NavbarClient user={user} />;
}
