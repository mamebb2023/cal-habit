import { Schema, models, model, Document } from "mongoose";

export interface IHabit extends Document {
  user_id: string;
  habit_name: string;
  dates: {
    date: { year: number; month: number; day: number };
    status: "done" | "undone";
  }[] ;
}

const DatesSchema = new Schema(
  {
    date: {
      year: { type: Number, required: true },
      month: { type: Number, required: true },
      day: { type: Number, required: true },
    },
    status: { type: String, enum: ["done", "undone"], required: true },
  },
  { _id: false } // Prevent _id from being added to each date entry
);

const HabitSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true, 
    ref: "User", // Reference to the User model
  },
  habit_name: { type: String, required: true },
  dates: [DatesSchema],
});

const Habit = models.Habit || model<IHabit>("Habit", HabitSchema);

export default Habit;
