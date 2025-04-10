import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
export const PUT = NextAuth(authOptions);
export const DELETE = NextAuth(authOptions); 