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
    console.log(isSignUp);
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
    <div className="w-full flex justify-center mt-8">
      <form className="flex flex-col w-6/12 items-center" onSubmit={onSubmit}>
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
            className="bg-violet-500 hover:bg-violet-700 text-white font-bold mx-2 my-2 px-2 py-1 rounded"
            type="submit"
          >
            {isSignUp ? "Sign up" : "Sign in"}
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mx-2 my-2 px-2 py-1 rounded"
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
