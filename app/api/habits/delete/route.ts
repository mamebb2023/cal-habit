import { connectToDatabase } from "@/lib/mongoose";
import Habit from "@/models/habit.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { habit_id } = await req.json(); // Expecting habit_id in the request body

  await connectToDatabase();

  // Check if the habit exists
  const habit = await Habit.findById(habit_id);

  if (!habit) {
    return NextResponse.json(
      { message: "Habit not found" },
      { status: 404 }
    );
  }

  // Delete the habit
  await Habit.deleteOne({ _id: habit_id });

  return NextResponse.json({ message: "Habit deleted successfully" });
}
