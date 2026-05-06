import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json(); // U

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Required Fields are empty" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const user = await User.findOne({ email });

  if (user) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  // encrypt password here

  await User.create({ name, email, password });

  return NextResponse.json(
    { message: "Registeration Success" },
    { status: 201 }
  );
}
