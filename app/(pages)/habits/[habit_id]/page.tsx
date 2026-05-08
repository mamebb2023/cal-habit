"use client";

import AreYouSurePrompt from "@/components/modals/AreYouSurePrompt";
import { days, months } from "@/constants";
import { getDaysForMonth, getLastTwoDigits, getUserFromToken } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import { useUserContext } from "@/context/UserContext";
import toast from "react-hot-toast";
import { BsCheck } from "react-icons/bs";
import { BiLeftArrowAlt, BiLock, BiTrash, BiX } from "react-icons/bi";

const Page = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { habit_id } = useParams() as { habit_id: string | undefined };

  const [habit, setHabit] = useState<{
    _id: string;
    habit_name: string;
    dates: {
      date: { year: number | null; month: number | null; day: number | null };
      status: "done" | "undone";
    }[];
  } | null>(null);

  const fetchHabit = useCallback(async () => {
    if (!habit_id) return;
    const loggedInUser = getUserFromToken();
    if (!loggedInUser) return;

    try {
      const res = await fetch(`/api/habits/get?user_id=${loggedInUser._id}`);
      if (res.ok) {
        const data = await res.json();
        const found = data.habits.find((h: { _id: string }) => h._id === habit_id);
        setHabit(found || null);
      }
    } catch (err) {
      console.error("Error fetching habit", err);
    }
  }, [habit_id]);

  useEffect(() => {
    fetchHabit();
  }, [fetchHabit]);

  const [selectedDay, setSelectedDay] = useState<{
    month: number | null;
    day: number | null;
  }>({ month: null, day: null });

  const [deleteHabitPrompt, setDeleteHabitPrompt] = useState(false);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();
  const currentMonth = currentDate.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleDayStatusUpdate = async ({
    day,
    month,
    year,
    status,
  }: {
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
        toast.success(data.message);
        fetchHabit();
      }
    } catch {
      console.error("Error updating day status");
    }
  };

  const handleDeleteHabit = async () => {
    if (!user) return null;

    try {
      const response = await fetch("/api/habits/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit_id }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        router.push("/habits");
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Error deleting habit. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col p-2 gap-3 overflow-y-hidden">
      <AnimatePresence>
        {deleteHabitPrompt && (
          <AreYouSurePrompt
            actionText="Delete"
            title="Are you sure to delete your habit?"
            onClose={() => setDeleteHabitPrompt(false)}
            onDelete={handleDeleteHabit}
          />
        )}
      </AnimatePresence>

      {/* Habits title */}
      <div className="px-3 py-2 bg-white rounded-2xl shadow-2xl flex items-center justify-between shrink-0">
        <div className="flex-center gap-2">
          <Link
            href="/habits"
            className="p-1 hover:bg-gray-500/10 rounded-full flex-center"
          >
            <BiLeftArrowAlt size={20} />
          </Link>
          <p className="font-semibold">{habit && habit.habit_name}</p>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => {
            const year = parseInt(e.target.value, 10);
            setSelectedYear(year);
            toast.success(`Year ${year} selected!`);
          }}
          className="w-[150px] border border-gray-200 p-1 px-2 rounded-lg cursor-pointer outline-none"
        >
          {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
            <option key={year} value={year} className="text-gray-900 bg-white">
              {year}
            </option>
          ))}
        </select>

        <div
          className="relative hover:bg-gray-500/10 p-2 rounded-lg border border-color-primary hover:border-transparent cursor-pointer flex-center transition"
          onClick={() => setDeleteHabitPrompt(!deleteHabitPrompt)}
        >
          <BiTrash size={20} />
        </div>
      </div>

      {/* Months calendar (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center flex-wrap gap-3 pb-5">
          {months.map((month, monthIndex) => {
            const adjustedMonth = monthIndex + 1;
            const daysForMonth = getDaysForMonth(selectedYear, monthIndex) as number[];

            return (
              <div
                key={monthIndex}
                className="w-[300px] px-3 py-2 bg-white rounded-2xl shadow-2xl border border-gray-500/30"
              >
                <div className="flex items-center justify-between border-b border-color-secondary pb-1 mb-2">
                  <p className="font-semibold">{month}</p>
                  <p className="body-2">
                    {adjustedMonth}/{getLastTwoDigits(`${selectedYear}`)}
                  </p>
                </div>

                <div className="grid grid-cols-7 text-center font-semibold mb-1">
                  {days.map((day) => (
                    <div key={day} className="p-1 text-color-tertiary text-[0.8em]">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysForMonth.map((day, index) => {
                    const habitDate = habit?.dates.find(
                      (d) =>
                        d.date.year === selectedYear &&
                        d.date.month === adjustedMonth &&
                        d.date.day === day
                    );

                    const isDone = habitDate?.status === "done";
                    const isUndone = habitDate?.status === "undone";

                    const isPastDate =
                      selectedYear < currentYear ||
                      (selectedYear === currentYear &&
                        (monthIndex < currentMonth ||
                          (monthIndex === currentMonth && day && day <= today)));

                    const daytoday = day && day === today && monthIndex === currentMonth;

                    return (
                      <div
                        key={index}
                        className={`relative flex-center p-1 border border-gray-500/30 rounded-[10px] ${daytoday
                          ? "text-white bg-gradient cursor-pointer border-none"
                          : isPastDate
                            ? "text-color-tertiary border-color-tertiary cursor-pointer"
                            : "text-gray-500/50 cursor-not-allowed"
                          } ${!day && "invisible"}`}
                        onClick={() =>
                          isPastDate &&
                          setSelectedDay((prev) =>
                            prev.day === day && prev.month === monthIndex
                              ? { day: null, month: null }
                              : { day, month: monthIndex }
                          )
                        }
                      >
                        <AnimatePresence>
                          {selectedDay.day === day && selectedDay.month === monthIndex && (
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 10, opacity: 0 }}
                              className="z-10 absolute p-1 -top-6 bg-white border rounded-full flex-center gap-1 text-color-primary"
                            >
                              <div
                                className="size-6 flex-center p-1 rounded-full text-[.7em] cursor-pointer bg-green-400 hover:bg-green-500 transition text-white"
                                onClick={() =>
                                  handleDayStatusUpdate({
                                    day,
                                    month: adjustedMonth,
                                    year: selectedYear,
                                    status: "done",
                                  })
                                }
                              >
                                <BsCheck size={18} />
                              </div>

                              <div
                                className="size-6 flex-center p-1 rounded-full text-[.7em] cursor-pointer bg-red-400 hover:bg-red-500 transition text-white"
                                onClick={() =>
                                  handleDayStatusUpdate({
                                    day,
                                    month: adjustedMonth,
                                    year: selectedYear,
                                    status: "undone",
                                  })
                                }
                              >
                                <BiX size={18} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <p className="text-[.9em] font-semibold">{day}</p>

                        <div className="absolute -top-2 -right-2 rounded-full text-[.6em] flex-center">
                          {habitDate ? (
                            isDone ? (
                              <div className="flex-center p-px text-white rounded-[50%] bg-green-500">
                                <BsCheck size={18} />
                              </div>
                            ) : (
                              isUndone && (
                                <div className="flex-center p-px text-white rounded-[50%] bg-red-500">
                                  <BiX size={18} />
                                </div>
                              )
                            )
                          ) : !isPastDate ? (
                            <BiLock className="opacity-70" size={18} />
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;