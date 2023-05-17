"use client";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { reminddata } from "@prisma/client";

function RemindModal({
  submitCallBack,
}: {
  submitCallBack: (title: string, date: [number, number, number, number, number]) => void;
}) {
  const [name, setName] = useState("");
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };

  const [date, setDate] = useState<[number, number, number, number, number]>([2000, 1, 1, 0, 0]);
  useEffect(() => {
    const date = new Date();
    setDate([date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours() + 1, date.getMinutes()]);
  }, []);

  const onDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "year") setDate((prev) => [Number(value), prev[1], prev[2], prev[3], prev[4]]);
    else if (name === "month") setDate((prev) => [prev[0], Number(value), prev[2], prev[3], prev[4]]);
    else if (name === "day") setDate((prev) => [prev[0], prev[1], Number(value), prev[3], prev[4]]);
    else if (name === "hour") setDate((prev) => [prev[0], prev[1], prev[2], Number(value), prev[4]]);
    else if (name === "minute") setDate((prev) => [prev[0], prev[1], prev[2], prev[3], Number(value)]);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitCallBack(name, date);
  };

  const option = (index: number) => (
    <option key={index} value={index}>
      {index}
    </option>
  );
  let yearArray = [];
  for (let i = 2000; i <= 2100; i++) yearArray.push(option(i));
  const monthArray = [];
  for (let i = 1; i <= 12; i++) monthArray.push(option(i));
  const dateArray = [];
  for (let i = 1; i <= 31; i++) dateArray.push(option(i));
  const hourArray = [];
  for (let i = 0; i <= 23; i++) hourArray.push(option(i));
  const minuteArray = [];
  for (let i = 0; i <= 59; i++) minuteArray.push(option(i));

  return (
    <form
      className="absolute flex flex-col h-48 rounded-lg top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-96 bg-slate-50"
      onSubmit={onSubmit}
    >
      <label className="mx-2 my-1 font-semibold">Name</label>
      <input className="mx-4 my-1 rounded bg-slate-200" value={name} onChange={onNameChange} required />
      <label className="mx-2 my-1 font-semibold">Remind Time</label>
      <div className="flex justify-around my-1">
        <span>Year</span>
        <span>Month</span>
        <span>Day</span>
        <span>Hour</span>
        <span>minute</span>
      </div>
      <div className="flex justify-around my-1">
        <select name="year" className="w-2/12" value={date[0]} onChange={onDateChange}>
          {yearArray.map((e) => e)}
        </select>
        <select name="month" className="w-2/12" value={date[1]} onChange={onDateChange}>
          {monthArray.map((e) => e)}
        </select>
        <select name="day" className="w-2/12" value={date[2]} onChange={onDateChange}>
          {dateArray.map((e) => e)}
        </select>
        <select name="hour" className="w-2/12" value={date[3]} onChange={onDateChange}>
          {hourArray.map((e) => e)}
        </select>
        <select name="minute" className="w-2/12" value={date[4]} onChange={onDateChange}>
          {minuteArray.map((e) => e)}
        </select>
      </div>
      <button
        type="submit"
        className="self-center mx-4 my-1 font-bold text-white bg-blue-500 rounded w-28 hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}

export default function RemindList() {
  const { data: session, status } = useSession();
  const [isWrite, setIsWrite] = useState(false);
  const queryClient = useQueryClient();

  const loadingData = async (id: string) => {
    if (!id) return [];
    const result = await (await fetch(`/api/data/${id}`, { headers: { "Content-Type": "application/json" } })).json();
    return result as reminddata[];
  };

  const { data, isLoading } = useQuery({
    queryKey: ["remindData"],
    queryFn: () => loadingData(session?.user?.email ?? ""),
    enabled: status === "authenticated",
    onError: (error) => console.log(error),
  });

  const writeMutation = useMutation({
    mutationFn: async (data: { target: string | null | undefined; data: string; time: Date }) => {
      await fetch("api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["remindData"] });
      setIsWrite(false);
    },
    onError: (error) => console.log(error),
  });

  const onWrite = async (title: string, date: [number, number, number, number, number]) => {
    if (!session?.user) return;
    const {
      user: { email },
    } = session;
    let copyDate: [number, number, number, number, number] = [...date];
    copyDate[1]--;
    const body = {
      target: email,
      data: title,
      time: new Date(...copyDate),
    };
    writeMutation.mutate(body);
  };

  const editMutation = useMutation({
    mutationFn: async (data: reminddata) => {
      await fetch("api/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["remindData"] }),
    onError: (error) => console.log(error),
  });

  const onComplete = async (id: number) => {
    let target = { ...data?.find((element) => element.id === id) };
    if (!target) return;
    target.isComplete = !target.isComplete;
    editMutation.mutate(target as reminddata);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const data = { id: id };
      await fetch(`api/data/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["remindData"] }),
    onError: (error) => console.log(error),
  });

  const onDelete = async (id: number) => {
    let target = { ...data?.find((element) => element.id === id) };
    if (!target.id) return;
    deleteMutation.mutate(target.id);
  };

  return (
    <div className="flex flex-col w-8/12 min-h-screen pt-12">
      {status === "authenticated" && (
        <button
          className="self-end block px-2 py-1 mx-2 mt-2 mb-4 font-bold text-white rounded w-28 bg-violet-500 hover:bg-violet-700"
          onClick={() => setIsWrite((prev) => !prev)}
        >
          add remind
        </button>
      )}
      {isWrite && <RemindModal submitCallBack={onWrite} />}
      {status === "unauthenticated" ? (
        <p className="text-xl font-semibold">Please sign in first</p>
      ) : isLoading ? (
        <h1 className="text-3xl font-bold underline">Loading...</h1>
      ) : data && data.length ? (
        <ul>
          {data
            .sort((a, b) => {
              const timeA = new Date(a.time);
              const timeB = new Date(b.time);
              return timeA.getTime() - timeB.getTime();
            })
            .map((element) => {
              const time = new Date(element.time);
              return (
                <li
                  key={element.id}
                  className={`flex justify-between py-2 px-2 my-2 rounded ${
                    element.isComplete ? "bg-green-400" : new Date().getTime() > time.getTime() ? "bg-red-400" : ""
                  }`}
                >
                  <span className="text-xl font-semibold">{element.data}</span>
                  <div className={`self-end `}>
                    <span className="mx-1">
                      {`${time.getFullYear()}. ${
                        time.getMonth() + 1
                      }. ${time.getDate()}, ${time.getHours()}:${time.getMinutes()}`}
                    </span>
                    <input
                      type="checkbox"
                      className="mx-1"
                      defaultChecked={element.isComplete}
                      onChange={() => onComplete(element.id)}
                    />
                    <button
                      className="w-20 px-2 py-1 mx-1 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700"
                      onClick={() => onDelete(element.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      ) : (
        <p className="text-xl font-semibold">No Data</p>
      )}
    </div>
  );
}
