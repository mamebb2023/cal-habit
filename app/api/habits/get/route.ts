import { connectToDatabase } from "@/lib/mongoose";
import Habit from "@/models/habit.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  try {
    const habits = await Habit.find({ user_id });

    if (habits.length === 0) {
      // For a new user with no habits yet, return an empty list with 200
      return NextResponse.json({ habits: [] }, { status: 200 });
    }

    return NextResponse.json({ habits });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { message: "Error retrieving habits" },
      { status: 500 }
    );
  }
}
