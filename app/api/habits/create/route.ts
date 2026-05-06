import { connectToDatabase } from "@/lib/mongoose";
import Habit from "@/models/habit.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user_id, habit_name } = await req.json();

  await connectToDatabase();

  const user = await User.findOne({ user_id });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  const habit = new Habit({
    user_id,
    habit_name,
    dates: []
  });

  await habit.save();

  return NextResponse.json({ message: "Habit created" });
}
