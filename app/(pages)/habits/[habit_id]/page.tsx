// habit id page

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
import { BiLeftArrowAlt, BiLoaderAlt, BiLock, BiTrash, BiX } from "react-icons/bi";

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
    const loadHabit = async () => {
      await fetchHabit();
    };

    void loadHabit();
  }, [fetchHabit]);

  const [selectedDay, setSelectedDay] = useState<{
    month: number;
    day: number;
  } | null>(null);

  const [isUpdating, setIsUpdating] = useState<"done" | "undone" | null>(null);

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
    setIsUpdating(status);

    try {
      const response = await fetch("/api/habits/update-day-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user._id, habit_id, day, month, year, status }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        await fetchHabit();
        setSelectedDay(null);
      }
    } catch {
      console.error("Error updating day status");
    } finally {
      setIsUpdating(null);
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

      <AnimatePresence>
        {selectedDay && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isUpdating && setSelectedDay(null)}
              className="fixed inset-0 z-50 bg-black/70 flex justify-center items-end backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed z-50 bottom-0 left-1/2 -translate-x-1/2 bg-white w-full max-w-md rounded-t-xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-400/40 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {months[selectedDay.month]} {selectedDay.day}, {selectedYear}
                  </p>
                  <p className="text-2xl font-bold mt-1 leading-tight text-gray-900">
                    {habit && habit.habit_name}
                  </p>
                </div>
                <button
                  disabled={isUpdating !== null}
                  onClick={() => setSelectedDay(null)}
                  className={`p-2 -mr-2 rounded-full hover:bg-gray-100 transition ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <BiX size={32} />
                </button>
              </div>

              <div className="text-center pt-4 text-gray-400 text-sm">
                Day {selectedDay.day} • {months[selectedDay.month]}
              </div>

              {/* Action Buttons */}
              <div className="p-4 mb-2 space-y-4">
                <button
                  disabled={isUpdating !== null}
                  onClick={() =>
                    handleDayStatusUpdate({
                      day: selectedDay.day,
                      month: selectedDay.month + 1,
                      year: selectedYear,
                      status: "done",
                    })
                  }
                  className={`w-full flex items-center justify-center gap-4 bg-green-500 text-white text-xl font-semibold p-3 rounded-2xl transition-all ${
                    isUpdating
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-green-600 active:bg-green-700 cursor-pointer"
                  }`}
                >
                  {isUpdating === "done" ? (
                    <BiLoaderAlt className="animate-spin" size={36} />
                  ) : (
                    <BsCheck size={36} />
                  )}
                  MARK AS DONE
                </button>

                <button
                  disabled={isUpdating !== null}
                  onClick={() =>
                    handleDayStatusUpdate({
                      day: selectedDay.day,
                      month: selectedDay.month + 1,
                      year: selectedYear,
                      status: "undone",
                    })
                  }
                  className={`w-full flex items-center justify-center gap-4 bg-red-500 text-white text-xl font-semibold p-3 rounded-2xl transition-all ${
                    isUpdating
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-red-600 active:bg-red-700 cursor-pointer"
                  }`}
                >
                  {isUpdating === "undone" ? (
                    <BiLoaderAlt className="animate-spin" size={36} />
                  ) : (
                    <BiX size={36} />
                  )}
                  MARK AS UNDONE
                </button>
              </div>
            </motion.div>
          </>
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
          className="w-37.5 border border-gray-200 p-1 px-2 rounded-lg cursor-pointer outline-none"
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
      <div className="flex-1 overflow-y-auto" data-lenis-prevent>
        <div className="flex justify-center flex-wrap gap-3 pb-5">
          {months.map((month, monthIndex) => {
            const adjustedMonth = monthIndex + 1;
            const daysForMonth = getDaysForMonth(selectedYear, monthIndex) as number[];

            return (
              <div
                key={monthIndex}
                className="w-75 px-3 py-2 bg-white rounded-2xl shadow-2xl border border-gray-500/30"
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
                        onClick={() => {
                          if (!isPastDate) return;
                          setSelectedDay({ day, month: monthIndex });
                        }}
                      >
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