import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface ParamsGet {
  id: string;
}

export async function GET(request: Request, context: { params: ParamsGet }) {
  try {
    const {
      params: { id },
    } = context;

    // SELECT * FROM remaindata WHERE target = params.id
    const postList = await prisma.reminddata.findMany({ where: { target: id } });
    return NextResponse.json(postList);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: ParamsGet }) {
  console.log(request.headers);
  try {
    const {
      params: { id },
    } = context;

    await prisma.reminddata.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
