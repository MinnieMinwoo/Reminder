import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const prisma = new PrismaClient();

    const data = await request.json();
    const { user, content, date } = data;
    console.log(typeof date);
    if (typeof user !== "string" || typeof content !== "string" || !(date !== "string"))
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const submitData = {
      data: {
        data: content,
        target: user,
        time: new Date(date),
        isComplete: false,
      },
    };
    await prisma.reminddata.create(submitData);
    return NextResponse.json(JSON.stringify(submitData));
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
