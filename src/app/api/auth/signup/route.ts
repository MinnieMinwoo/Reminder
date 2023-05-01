import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  //if (!body) return NextResponse.json({ error: "No body" }, { status: 400 });
  try {
    const { nickname, email, password } = await request.json();
    if (!(typeof nickname == "string") || !(typeof email == "string") || !(typeof password == "string"))
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const prisma = new PrismaClient();
    const user = {
      email: email,
      nickname: nickname,
      password: hashedPassword,
      salt: salt,
    };
    await prisma.userdata.create({ data: user });
    return NextResponse.json({});
  } catch (error) {
    console.log(error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
