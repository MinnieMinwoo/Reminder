"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();
  return (
    <>
      <button
        className="bg-violet-500 hover:bg-violet-700 text-white font-bold mx-2 my-2 px-2 py-1 rounded"
        onClick={status === "loading" ? () => {} : session ? () => signOut() : () => signIn()}
      >
        {status === "loading" ? "" : session ? "Sign out" : "Sign in"}
      </button>
    </>
  );
}
