"use client";

import { useCallback, useEffect, useState } from "react";
import AddHabit from "@/components/modals/AddHabit";
import AddHabitBtn from "@/components/modals/AddHabitBtn";
import { AnimatePresence, motion } from "framer-motion";
import { useUserContext } from "@/context/UserContext";
import { getDaysForMonth, getLastTwoDigits, getUserFromToken } from "@/lib/utils";
import toast from "react-hot-toast";
import { Fleur_De_Leah } from "next/font/google";
import { days, months } from "@/constants";
import Link from "next/link";
import { BiLock, BiRightArrowAlt, BiX } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";

const font = Fleur_De_Leah({ subsets: ["latin"], weight: "400" });

const Page = () => {
  const { user } = useUserContext();
  const [addHabit, setAddHabit] = useState(false);
  const [habitName, setHabitName] = useState("");

  const [habits, setHabits] = useState<
    {
      _id: string;
      user_id: string;
      habit_name: string;
      dates: {
        date: { year: number | null; month: number | null; day: number | null };
        status: "done" | "undone";
      }[];
    }[]
  >([]);

  const [selectedDay, setSelectedDay] = useState<{
    month: number | null;
    habitIndex: number | null;
    day: number | null;
  }>({ month: null, habitIndex: null, day: null });

  const currentDate = new Date();
  const today = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysForMonth = getDaysForMonth(currentYear, currentMonth) as number[];

  const fetchHabits = useCallback(async () => {
    const loggedInUser = getUserFromToken();
    if (!loggedInUser) return;

    try {
      const res = await fetch(`/api/habits/get?user_id=${loggedInUser._id}`);
      if (res.ok) {
        const data = await res.json();
        setHabits(data.habits);
      }
    } catch (err) {
      console.error("Error fetching habits", err);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleDayStatusUpdate = async ({
    habit_id,
    day,
    month,
    year,
    status,
  }: {
    habit_id: string;
    day: number;
    month: number;
    year: number;
    status: "done" | "undone";
  }) => {
    if (!user) return null;

    try {
      const response = await fetch("/api/habits/update-day-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user._id, habit_id, day, month, year, status }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${data.message} Day ${day} status updated to ${status}.`);
        fetchHabits();
      }
    } catch {
      console.error("Error updating day status");
    }
  };

  const handleCreateHabit = async () => {
    setAddHabit(false);
    if (!user) return null;

    try {
      const trimmedHabitName = habitName.trim();

      if (!trimmedHabitName) {
        toast.error("Habit name cannot be empty.");
        return;
      }

      const response = await fetch("/api/habits/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user._id, habit_name: trimmedHabitName }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        fetchHabits();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <>
      <AnimatePresence>
        {addHabit && (
          <AddHabit
            onClose={() => setAddHabit(false)}
            onInputChange={setHabitName}
            handleCreateHabit={() => handleCreateHabit()}
          />
        )}
      </AnimatePresence>

      {/* MAIN WRAPPER MUST HAVE HEIGHT */}
      <div className="relative flex flex-col gap-3 h-screen overflow-y-auto p-2">
        {/* habits title */}
        <div className="px-3 py-2 bg-white rounded-2xl shadow-2xl flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
          <p className={`text-xl ${font.className}`}>{currentYear}</p>
          <AddHabitBtn onClick={() => setAddHabit(true)} />
        </div>

        <div className="flex-1 overflow-y-auto pb-5">
          <div className="flex justify-center md:justify-start flex-wrap gap-3 p-2">
            {habits.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-gray-300/80 bg-gray-50/80">
                <p className="text-lg font-semibold text-gray-900">
                  You don&apos;t have any habits yet
                </p>
                <p className="mt-1 text-sm text-gray-600 max-w-md">
                  Start by creating your first habit to begin tracking your progress.
                </p>
                <div className="mt-4">
                  <AddHabitBtn onClick={() => setAddHabit(true)} />
                </div>
              </div>
            ) : (
              habits.map((habit, habitIndex) => {
                const adjustedMonth = currentMonth + 1;

                return (
                  <div key={habitIndex} className="flex flex-col gap-1">
                    {/* habit name */}
                    <Link
                      href={`/habits/${habit._id}`}
                      className="flex items-center justify-between px-3 py-1 hover:bg-gray-500/10 rounded-lg transition"
                    >
                      <p className="font-bold">
                        {habit.habit_name.length > 30
                          ? habit.habit_name.slice(0, 30) + "…"
                          : habit.habit_name}
                      </p>
                      <BiRightArrowAlt size={18} />
                    </Link>

                    {/* calendar box */}
                    <div className="w-[300px] px-3 py-2 bg-white rounded-2xl shadow-2xl">
                      <div className="flex items-center justify-between border-b border-color-secondary pb-1 mb-2">
                        <p className="font-semibold">{months[currentMonth]}</p>
                        <p className="text-sm">
                          {adjustedMonth}/{getLastTwoDigits(`${currentYear}`)}
                        </p>
                      </div>

                      <div className="grid grid-cols-7 text-center font-semibold mb-1">
                        {days.map((day) => (
                          <div
                            key={day}
                            className="p-1 text-color-tertiary text-[0.8em]"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center">
                        {daysForMonth.map((day, index) => {
                          const habitDate = habit.dates.find(
                            (d) =>
                              d.date.year === currentYear &&
                              d.date.month === adjustedMonth &&
                              d.date.day === day
                          );

                          const isDone = habitDate?.status === "done";
                          const isUndone = habitDate?.status === "undone";
                          const isPastDate = day < today;
                          const isToday = day === today;

                          return (
                            <div
                              key={index}
                              className={`relative flex-center p-1 border rounded-[10px] ${isToday
                                ? "text-white bg-gradient cursor-pointer border-none"
                                : isPastDate
                                  ? "text-color-tertiary border-color-tertiary cursor-pointer"
                                  : "text-black/50 border-gray-500/70 cursor-not-allowed"
                                } ${!day && "invisible"}`}
                              onClick={() =>
                                day <= today &&
                                setSelectedDay((prev) =>
                                  prev.habitIndex === habitIndex &&
                                    prev.day === day &&
                                    prev.month === currentMonth
                                    ? { habitIndex: null, day: null, month: null }
                                    : { habitIndex, day, month: currentMonth }
                                )
                              }
                            >
                              <AnimatePresence>
                                {selectedDay.habitIndex === habitIndex &&
                                  selectedDay.day === day && (
                                    <motion.div
                                      initial={{ y: 10, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      exit={{ y: 10, opacity: 0 }}
                                      className="z-10 absolute p-1 -top-6 bg-white border rounded-full flex-center gap-1"
                                    >
                                      <div
                                        className="size-6 flex-center p-1 rounded-full text-[.7em] cursor-pointer bg-green-400 hover:bg-green-500 transition text-white"
                                        onClick={() =>
                                          handleDayStatusUpdate({
                                            habit_id: habit._id,
                                            day,
                                            month: adjustedMonth,
                                            year: currentYear,
                                            status: "done",
                                          })
                                        }
                                      >
                                        <BsCheck size={16} />
                                      </div>

                                      <div
                                        className="size-6 flex-center p-1 rounded-full text-[.7em] cursor-pointer bg-red-400 hover:bg-red-500 transition text-white"
                                        onClick={() =>
                                          handleDayStatusUpdate({
                                            habit_id: habit._id,
                                            day,
                                            month: adjustedMonth,
                                            year: currentYear,
                                            status: "undone",
                                          })
                                        }
                                      >
                                        <BiX size={16} />
                                      </div>
                                    </motion.div>
                                  )}
                              </AnimatePresence>

                              {day}

                              <div className="absolute -top-2 -right-2 text-white rounded-full text-[.6em] flex-center">
                                {habitDate ? (
                                  isDone ? (
                                    <div className="flex-center p-px rounded-full bg-green-500">
                                      <BsCheck size={16} />
                                    </div>
                                  ) : (
                                    isUndone && (
                                      <div className="flex-center p-px rounded-full bg-red-500">
                                        <BiX size={16} />
                                      </div>
                                    )
                                  )
                                ) : day > today ? (
                                  <BiLock size={16} className="text-gray-400" />
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;