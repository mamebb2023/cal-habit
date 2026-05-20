"use client";

import AddHabit from "@/components/modals/AddHabit";
import AddHabitBtn from "@/components/modals/AddHabitBtn";
import { days, months } from "@/constants";
import { useUserContext } from "@/context/UserContext";
import {
  getDaysForMonth,
  getLastTwoDigits,
  getUserFromToken,
} from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Fleur_De_Leah } from "next/font/google";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiLoaderAlt, BiLock, BiRightArrowAlt, BiX } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";

const font = Fleur_De_Leah({ subsets: ["latin"], weight: "400" });

const Page = () => {
  const { user } = useUserContext();
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

  const [addHabit, setAddHabit] = useState(false);

  const [habitName, setHabitName] = useState("");

  const currentDate = new Date();
  const today = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const adjustedMonth = currentMonth + 1;
  const currentYear = currentDate.getFullYear();
  const daysForMonth = getDaysForMonth(currentYear, currentMonth) as number[];

  // Mobile Full Screen Popup
  const [selectedDay, setSelectedDay] = useState<{
    habitIndex: number;
    day: number;
    habitId: string;
    habitName: string;
  } | null>(null);

  const [isUpdating, setIsUpdating] = useState<"done" | "undone" | null>(null);

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
    const loadHabit = async () => {
      await fetchHabits();
    };

    void loadHabit();
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
    setIsUpdating(status);

    try {
      const response = await fetch("/api/habits/update-day-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user._id,
          habit_id,
          day,
          month,
          year,
          status,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `${data.message} Day ${day} status updated to ${status}.`,
        );
        await fetchHabits();
        setSelectedDay(null);
      }
    } catch {
      console.error("Error updating day status");
    } finally {
      setIsUpdating(null);
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
        body: JSON.stringify({
          user_id: user._id,
          habit_name: trimmedHabitName,
        }),
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

  const scrollContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (habits.length > 0) {
      scrollContainerRefs.current.forEach((container) => {
        if (container) {
          const todayElement = container.querySelector(`[data-day="${today}"]`);
          if (todayElement) {
            todayElement.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest",
            });
          }
        }
      });
    }
  }, [habits, today]);

  return (
    <>
      <AnimatePresence>
        {addHabit && (
          <AddHabit
            onClose={() => setAddHabit(false)}
            onInputChange={setHabitName}
            handleCreateHabit={handleCreateHabit}
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
              className="fixed z-50 bottom-0 left-1/2 -translate-x-1/2 bg-white min-w-sm max-w-md mx-1 rounded-t-xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-400/40 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {months[currentMonth]} {selectedDay.day}, {currentYear}
                  </p>
                  <p className="text-lg md:text-2xl font-bold mt-1 leading-tight">
                    {selectedDay.habitName}
                  </p>
                </div>
                <button
                  disabled={isUpdating !== null}
                  onClick={() => setSelectedDay(null)}
                  className={`p-2 -mr-2 rounded-full hover:bg-gray-100 transition ${
                    isUpdating
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <BiX size={32} />
                </button>
              </div>

              <div className="text-center pt-4 text-gray-400 text-sm">
                Day {selectedDay.day} • {months[currentMonth]}
              </div>

              {/* Action Buttons */}
              <div className="p-4 mb-2 space-y-4">
                <button
                  disabled={isUpdating !== null}
                  onClick={() =>
                    handleDayStatusUpdate({
                      habit_id: selectedDay.habitId,
                      day: selectedDay.day,
                      month: adjustedMonth,
                      year: currentYear,
                      status: "done",
                    })
                  }
                  className={`w-full flex items-center justify-center gap-4 bg-green-500 text-white text-md md:text-xl font-semibold p-3 rounded-2xl transition-all ${
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
                      habit_id: selectedDay.habitId,
                      day: selectedDay.day,
                      month: adjustedMonth,
                      year: currentYear,
                      status: "undone",
                    })
                  }
                  className={`w-full flex items-center justify-center gap-4 bg-red-500 text-white text-md md:text-xl font-semibold p-3 rounded-2xl transition-all ${
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

      <div className="relative flex flex-col gap-3 h-screen p-2">
        {/* habits title */}
        <div className="px-3 py-2 bg-white rounded-2xl shadow-2xl flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
          <p className={`text-xl ${font.className}`}>{currentYear}</p>
          <AddHabitBtn onClick={() => setAddHabit(true)} />
        </div>

        <div className="flex flex-col items-center md:items-start gap-3 md:flex-row ">
          {/* habits list */}
          {habits.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-gray-300/80 bg-gray-50/80">
              <p className="text-lg font-semibold text-gray-900">
                You don&apos;t have any habits yet
              </p>
              <p className="mt-1 text-sm text-gray-600 max-w-md">
                Start by creating your first habit to begin tracking your
                progress.
              </p>
              <div className="mt-4">
                <AddHabitBtn onClick={() => setAddHabit(true)} />
              </div>
            </div>
          ) : (
            habits.map((habit, habitIndex) => {
              return (
                <div
                  key={habitIndex}
                  className="flex flex-col gap-1 max-w-[90vw] md:w-auto"
                >
                  {/* habit name */}
                  <Link
                    href={`/habits/${habit._id}`}
                    className="flex items-center justify-between px-3 py-1 m-1 hover:bg-gray-400/10 rounded-lg transition"
                  >
                    <p className="font-bold">
                      {habit.habit_name.length > 30
                        ? habit.habit_name.slice(0, 30) + "…"
                        : habit.habit_name}
                    </p>
                    <BiRightArrowAlt size={18} />
                  </Link>

                  <div className="px-3 py-2 bg-white rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between border-b border-color-secondary pb-1 mb-2">
                      <p className="font-semibold">{months[currentMonth]}</p>
                      <p className="text-sm">
                        {adjustedMonth}/{getLastTwoDigits(`${currentYear}`)}
                      </p>
                    </div>

                    {/* Desktop: Grid layout */}
                    <div className="">
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
                              d.date.day === day,
                          );

                          const isDone = habitDate?.status === "done";
                          const isUndone = habitDate?.status === "undone";
                          const isPastDate = day < today;
                          const isToday = day === today;

                          return (
                            <div
                              key={index}
                              className={`relative flex-center p-1 border rounded-[10px] ${
                                isToday
                                  ? "text-white bg-gradient cursor-pointer border-none"
                                  : isPastDate
                                    ? "text-color-tertiary border-color-tertiary cursor-pointer"
                                    : "text-black/50 border-gray-500/70 cursor-not-allowed"
                              } ${!day && "invisible"}`}
                              onClick={() => {
                                if (day > today) return;
                                setSelectedDay({
                                  habitIndex,
                                  day,
                                  habitId: habit._id,
                                  habitName: habit.habit_name,
                                });
                              }}
                            >
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

                    {/* mobile view
                    <div
                      className="hidden gap-2 py-2 overflow-x-auto"
                      ref={(el) => {
                        scrollContainerRefs.current[habitIndex] = el;
                      }}
                    >
                      {daysForMonth
                        .filter((day) => day)
                        .map((day) => {
                          const habitDate = habit.dates.find(
                            (d) =>
                              d.date.year === currentYear &&
                              d.date.month === adjustedMonth &&
                              d.date.day === day,
                          );

                          const isDone = habitDate?.status === "done";
                          const isUndone = habitDate?.status === "undone";
                          const isPastDate = day < today;
                          const isToday = day === today;

                          return (
                            <div
                              key={day}
                              data-day={day}
                              className={`relative shrink-0 flex items-center justify-center text-sm size-7 md:size-8 border rounded-lg
                            ${
                              isToday
                                ? "text-white bg-gradient cursor-pointer border-none"
                                : isPastDate
                                  ? "text-color-tertiary border-color-tertiary cursor-pointer"
                                  : "text-black/50 border-gray-500/70 cursor-not-allowed"
                            }`}
                              onClick={() => {
                                if (day > today) return;
                                setSelectedDay({
                                  habitIndex,
                                  day,
                                  habitId: habit._id,
                                  habitName: habit.habit_name,
                                });
                              }}
                            >
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
                    </div> */}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
