"use client";
import { useSession, signIn, signOut } from "next-auth/react";
export default function LoginButton() {
  const { data: session } = useSession();
  console.log(session);
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <button
        className="bg-violet-500 hover:bg-violet-700 text-white font-bold mx-2 my-2 px-2 py-1 rounded"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
