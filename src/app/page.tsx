"use client";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: session, status } = useSession();

  const loadingData = async (id: string) => {
    console.log(id);
    if (!id) return [];
    const result = await (await fetch(`/api/data/${id}`, { headers: { "Content-Type": "application/json" } })).json();
    return result;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["remindData"],
    queryFn: () => loadingData(session?.user?.email ?? ""),
    enabled: status === "authenticated",
  });

  console.log(data);
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      {isLoading ? (
        <h1 className="text-3xl font-bold underline">Loading...</h1>
      ) : (
        data.map((remind: any) => {
          <p>{remind}</p>;
        })
      )}
    </main>
  );
}
