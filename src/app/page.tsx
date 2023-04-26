import { Inter } from "next/font/google";
import LoginButton from "@/components/LoginButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold underline">hi</h1>
    </main>
  );
}
