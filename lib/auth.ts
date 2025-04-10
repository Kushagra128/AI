import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/firebase/admin";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Find user in Firestore
          const userSnapshot = await db
            .collection("users")
            .where("email", "==", credentials.email)
            .limit(1)
            .get();
          
          if (userSnapshot.empty) {
            return null;
          }
          
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          
          // In a real app, you should verify password here
          // This is just a simplified example
          
          return {
            id: userDoc.id,
            name: userData.name || "",
            email: userData.email,
            image: userData.image || null,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Cast user to any to avoid TypeScript error
        // NextAuth types don't include id by default
        token.id = (user as any).id;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      try {
        // Check if user exists in Firestore
        const userSnapshot = await db
          .collection("users")
          .where("email", "==", user.email)
          .limit(1)
          .get();
        
        if (userSnapshot.empty) {
          // Create new user if doesn't exist
          await db.collection("users").add({
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date().toISOString(),
            provider: account?.provider || "credentials"
          });
        }
        
        return true;
      } catch (error) {
        console.error("Sign in callback error:", error);
        return false;
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
}; 