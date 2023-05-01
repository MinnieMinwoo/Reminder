import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email: originalEmail, password: originalPassword } = credentials as { email: string; password: string };
        const prisma = new PrismaClient();
        // SELECT * FROM userdata WHERE email = '${email}'
        try {
          const data = await prisma.userdata.findUnique({ where: { email: originalEmail } });
          if (!data) return null;
          const { id, nickname, password, salt } = data;
          const hashedPassword = await bcrypt.hash(originalPassword, salt);
          if (hashedPassword != password) return null;
          const user = { id: String(id), name: nickname, email: originalEmail };
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  secret: process.env.SECRET as string,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
