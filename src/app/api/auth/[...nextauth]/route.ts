import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { pg } from "@/config/database";
import { QueryResult } from "pg";
import { PrismaClient } from "@prisma/client";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as { email: string; password: string };
        const prisma = new PrismaClient();
        // SELECT * FROM userdata WHERE email = '${email}'
        const res = await prisma.userdata.findUnique({ where: { email: email } });
        const query = ``;
        console.log(res);
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.SECRET as string,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
