import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

interface ParamsGet {
  id: string;
}

export async function GET(request: Request, context: { params: ParamsGet }) {
  try {
    const {
      params: { id },
    } = context;
    const prisma = new PrismaClient();

    // SELECT * FROM remaindata WHERE target = params.id
    const postList = await prisma.reminddata.findMany({ where: { target: id } });
    return NextResponse.json(postList);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
