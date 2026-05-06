import { connectToDatabase } from "@/lib/mongoose";
import Habit from "@/models/habit.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

interface DateEntry {
  date: {
    year: number;
    month: number;
    day: number;
  };
  status: "done" | "undone";
}

interface HabitDocument {
  user_id: string;
  habit_name: string;
  dates: DateEntry[];
}

export async function POST(req: NextRequest) {
  const { user_id, habit_id, year, month, day, status } = await req.json();

  await connectToDatabase();

  // Find the user
  const user = await User.findOne({ user_id });
  if (!user) {
    return NextResponse.json({ message: "User not found!" }, { status: 404 });
  }

  // Find the habit
  const habit = await Habit.findOne({ user_id, _id: habit_id });
  if (!habit) {
    console.log("Habit not found!");
    return NextResponse.json({ message: "Habit not found!" }, { status: 404 });
  }

  // Check if the status is valid
  if (!["done", "undone"].includes(status)) {
    return NextResponse.json(
      { message: "Invalid status. Must be 'done' or 'undone'." },
      { status: 400 }
    );
  }

  // Check if the date entry exists and if the status matches
  const existingDate: DateEntry | undefined = (
    habit as HabitDocument
  ).dates.find(
    (entry: DateEntry) =>
      entry.date.year === year &&
      entry.date.month === month &&
      entry.date.day === day
  );

  // If the status is already the same, do nothing
  if (existingDate && existingDate.status === status) {
    return NextResponse.json({ message: "No changes needed!" });
  }

  // Attempt to update an existing date entry
  const result = await Habit.updateOne(
    { _id: habit_id, user_id: user_id },
    {
      $set: {
        "dates.$[elem].status": status,
      },
    },
    {
      arrayFilters: [
        {
          "elem.date.year": year,
          "elem.date.month": month,
          "elem.date.day": day,
        },
      ],
    }
  );

  // If no document was updated, push a new date entry
  if (result.modifiedCount === 0) {
    await Habit.updateOne(
      { _id: habit_id, user_id: user_id },
      {
        $push: {
          dates: { date: { year, month, day }, status },
        },
      }
    );

    return NextResponse.json({ message: "Added!" });
  } else {
    return NextResponse.json({ message: "Updated!" });
  }
}
