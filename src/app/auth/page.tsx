"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Page() {
  const [isSignUp, setIsSignUp] = useState(false);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => setIsSignUp((prev) => !prev);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { target } = event;
    if (!(target instanceof HTMLFormElement)) return;
    if (isSignUp) {
      const {
        nickname: { value: nickname },
        email: { value: email },
        password: { value: password },
      } = target;
      const body = {
        nickname: nickname,
        email: email,
        password: password,
      };
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await signIn("credentials", { email, password, callbackUrl: "/" });
    } else {
      const {
        email: { value: email },
        password: { value: password },
      } = target;
      await signIn("credentials", { email, password, callbackUrl: "/" });
    }
  };

  const labelClass = "self-start text-lg font-semibold text-gray-900";
  const inputClass =
    "w-full my-3 h-8 rounded ring-2 ring-violet-300 hover:ring-violet-500 focus:ring-violet-600 focus:outline-none text-gray-600";
  return (
    <div className="flex justify-center w-full mt-8">
      <form className="flex flex-col items-center w-6/12" onSubmit={onSubmit}>
        {isSignUp ? (
          <>
            <label className={labelClass}>Nickname</label>
            <input className={inputClass} type="text" name="nickname" placeholder="nickname" required />
          </>
        ) : null}
        <label className={labelClass}>Email</label>
        <input className={inputClass} type="email" name="email" placeholder="email" required />
        <label className={labelClass}>Password</label>
        <input className={inputClass} type="password" name="password" placeholder="password" required />
        <div>
          <button
            className="px-2 py-1 mx-2 my-2 font-bold text-white rounded bg-violet-500 hover:bg-violet-700"
            type="submit"
          >
            {isSignUp ? "Sign up" : "Sign in"}
          </button>
          <button
            className="px-2 py-1 mx-2 my-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            type="button"
            onClick={onClick}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
