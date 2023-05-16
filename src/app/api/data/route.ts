import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { target, data: content, time } = data;
    if (typeof target !== "string" || typeof content !== "string" || !(time !== "string"))
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const submitData = {
      data: {
        data: content,
        target: target,
        time: new Date(time),
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

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, data: content, time, isComplete, target } = data;
    if (
      typeof id !== "number" ||
      typeof time !== "string" ||
      typeof isComplete !== "boolean" ||
      typeof target !== "string"
    )
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const submitData = {
      data: content,
      time: time,
      isComplete: isComplete,
      target: target,
    };
    await prisma.reminddata.update({
      where: {
        id: id,
      },
      data: {
        data: content,
        time: new Date(time),
        isComplete: isComplete,
        target: target,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
