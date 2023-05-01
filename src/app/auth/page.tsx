"use client";

import { signIn } from "next-auth/react";

export default function Page() {
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nickname = (event.target as HTMLFormElement).nickname.value;
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
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
  };

  const onSubmitTest = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    const body = {
      email: email,
      password: password,
    };
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <label>nickname</label>
        <input type="text" name="nickname" placeholder="nickname" required />
        <label>Email</label>
        <input type="email" name="email" placeholder="email" required />
        <label>Password</label>
        <input type="password" name="password" placeholder="password" required />
        <button type="submit">Sign up</button>
      </form>
      <form onSubmit={onSubmitTest}>
        <label>Email</label>
        <input type="email" name="email" placeholder="email" required />
        <label>Password</label>
        <input type="password" name="password" placeholder="password" required />
        <button type="submit">Sign in</button>
      </form>
    </>
  );
}
