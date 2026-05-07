import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { getUserFromToken, isMobile, miniText } from "@/lib/utils";
import Image from "next/image";
import {
  BiCheck,
  BiChevronRight,
  BiLogOut,
  BiPlus,
  BiUser,
  BiX,
} from "react-icons/bi";
import AreYouSurePrompt from "./modals/AreYouSurePrompt";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { months } from "@/constants";
import AddHabit from "./modals/AddHabit";
import toast from "react-hot-toast";
import { Suspense } from "./ui/Suspense";
import Skeleton from "./ui/Skeleton";


type Habit = {
  _id: string;
  user_id: string;
  habit_name: string;
  dates: {
    date: { year: number | null; month: number | null; day: number | null };
    status: "done" | "undone";
  }[];
};

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [addHabit, setAddHabit] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [expandedHabits, setExpandedHabits] = useState<Record<string, boolean>>({});
  const { user, logout } = useUserContext();
  const router = useRouter();

  const currentYear = new Date().getFullYear();

  const fetchHabits = async () => {
    const user = getUserFromToken();
    if (!user) {
      setHabitsLoading(false);
      return;
    }
    setHabitsLoading(true);
    try {
      const res = await fetch(`/api/habits/get?user_id=${user._id}`);
      if (res.ok) {
        const data = await res.json();
        setHabits(data.habits);
      }
    } catch (err) {
      console.error("SideBar: error fetching habits", err);
    } finally {
      setHabitsLoading(false);
    }
  };

  useEffect(() => {
    if (isMobile()) {
      setCollapsed(true);
    }

    fetchHabits();
  }, []);

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
        headers: {
          "Content-Type": "application/json",
        },
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

  const getMonthData = (habit: Habit, year: number, month: number) => {
    const monthDates = habit.dates.filter(
      (d) => d.date.year === year && d.date.month === month
    );
    const doneCount = monthDates.filter((d) => d.status === "done").length;
    const undoneCount = monthDates.filter((d) => d.status === "undone").length;
    return { doneCount, undoneCount };
  };

  return (
    <>
      <AnimatePresence>
        {logoutPrompt && (
          <AreYouSurePrompt
            title="Are you sure you want to logout?"
            onClose={() => setLogoutPrompt(false)}
            onDelete={logout}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addHabit && (
          <AddHabit
            onClose={() => setAddHabit(false)}
            onInputChange={setHabitName}
            handleCreateHabit={() => handleCreateHabit()}
          />
        )}
      </AnimatePresence>

      <div className={`${collapsed ? "w-14" : "w-68"} relative flex flex-col justify-between gap-3 md:h-full transition-all duration-300 ease-in-out`}>
        {/* logo and collapse */}
        <div className={`flex items-center justify-between gap-3 px-3 py-2 bg-white rounded-2xl shadow-2xl`}>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center">
                <Link href="/" className="shrink-0">
                  <Image
                    src="/logo.png"
                    alt="CalHabit Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                  />
                </Link>
                <span className="ml-2">
                  CalHabit
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button className="flex-center size-7 rounded-md p-1 bg-gray-500/5 hover:bg-gray-500/10 transition-all cursor-pointer" onClick={() => setCollapsed((prev) => !prev)} style={{ boxShadow: "inset -2px -2px 7px #dededeff" }}>
            {collapsed ? (
              <TbLayoutSidebarRightCollapseFilled size={18} />
            ) : (
              <TbLayoutSidebarLeftCollapseFilled size={18} />
            )}
          </button>
        </div>

        <div className="relative shrink-0 p-3 bg-white rounded-2xl shadow-2xl flex-1 min-h-0 flex flex-col items-center">
          <div className="w-full flex-1 min-h-0 overflow-y-auto">
            {/* title */}
            {!collapsed && (
              <AnimatePresence>
                <motion.h2
                  className="px-2 pt-2 text-lg font-semibold text-gray-600"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  Habits
                </motion.h2>
              </AnimatePresence>
            )}

            {/* middle: habit summary */}
            {!collapsed && (
              <div className="hidden md:flex flex-col gap-3 py-3 px-1">
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-3">
                      <Skeleton width={200} height={100} />
                      <Skeleton width={200} height={100} />
                      <Skeleton width={200} height={100} />
                    </div>
                  }
                  loading={habitsLoading}
                >
                  {habits.map((habit) => {
                    const displayName = miniText(20, habit.habit_name);
                    const isExpanded = expandedHabits[habit._id];

                    const visibleMonths = months
                      .map((monthName, monthIndex) => {
                        const { doneCount, undoneCount } = getMonthData(
                          habit,
                          currentYear,
                          monthIndex + 1
                        );
                        if (doneCount === 0 && undoneCount === 0) return null;
                        return { monthName, monthIndex, doneCount, undoneCount };
                      })
                      .filter(Boolean) as {
                        monthName: string;
                        monthIndex: number;
                        doneCount: number;
                        undoneCount: number;
                      }[];

                    const showToggle = visibleMonths.length > 3;
                    const displayedMonths = isExpanded
                      ? visibleMonths
                      : visibleMonths.slice(0, 3);

                    return (
                      <motion.div
                        key={habit._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-2 p-3 rounded-xl bg-gray-500/5"
                      >
                        {/* Title with arrow */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm text-gray-800 leading-none">
                            {displayName}
                          </p>
                          <Link
                            href={`/habits/${habit._id}`}
                            className="flex-center size-6 rounded-md hover:bg-gray-500/20 transition-all shrink-0 cursor-pointer"
                          >
                            <BiChevronRight size={18} className="text-gray-600" />
                          </Link>
                        </div>

                        {/* Year */}
                        <p className="text-xs font-semibold text-gray-600">
                          {currentYear}
                        </p>

                        {/* Months with counts */}
                        <div className="flex flex-col gap-1.5">
                          <div className="relative">
                            <div className="flex flex-col gap-1.5">
                              {displayedMonths.map(
                                ({ monthName, monthIndex, doneCount, undoneCount }) => (
                                  <div
                                    key={monthIndex}
                                    className="flex items-center justify-between gap-2 px-2 py-1 rounded-lg bg-white/50"
                                  >
                                    <span className="text-xs font-medium text-gray-700">
                                      {monthName.slice(0, 3)}
                                    </span>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <div className="flex items-center gap-1">
                                        <span className="flex-center size-4 rounded-full bg-green-100 text-green-600">
                                          <BiCheck size={10} />
                                        </span>
                                        <span className="text-xs font-semibold text-green-600">
                                          {doneCount}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="flex-center size-4 rounded-full bg-red-100 text-red-500">
                                          <BiX size={10} />
                                        </span>
                                        <span className="text-xs font-semibold text-red-500">
                                          {undoneCount}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Gradient fade + Show more */}
                            {showToggle && !isExpanded && (
                              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-100 to-transparent rounded-b-lg flex items-end justify-center pb-1">
                                <button
                                  onClick={() =>
                                    setExpandedHabits((prev) => ({
                                      ...prev,
                                      [habit._id]: true,
                                    }))
                                  }
                                  className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                  Show more
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Show less */}
                          {showToggle && isExpanded && (
                            <button
                              onClick={() =>
                                setExpandedHabits((prev) => ({
                                  ...prev,
                                  [habit._id]: false,
                                }))
                              }
                              className="text-[10px] font-semibold text-gray-400 hover:text-gray-600 transition-colors mt-0.5 cursor-pointer"
                            >
                              Show less
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </Suspense>
              </div>
            )}
          </div>

          {/* Add New Habit button */}
          {!collapsed &&
            <button
              className="flex-center w-full rounded-full p-2 text-sm bg-gradient-to-r from-color-primary via-color-secondary to-color-tertiary text-white transition-all cursor-pointer hover:opacity-90 shrink-0"
              onClick={() => setAddHabit(true)}
            >
              <BiPlus size={20} /> Add New Habit
            </button>
          }
        </div>

        {/* footer profile */}
        <div
          className="relative mt-auto flex items-center gap-2 px-3 py-2 bg-white rounded-2xl shadow-2xl hover:bg-white/50 transition-all cursor-pointer"
          onClick={() => setProfileMenu(!profileMenu)}
        >
          <button
            className="flex-center size-8 rounded-full p-1 bg-gray-500/5 border border-gray-300  transition-all cursor-pointer"
            style={{ boxShadow: "inset -2px -2px 7px #dededeff" }}
          >
            <BiUser size={24} />
          </button>

          {/* {`${isLoading}`} */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="flex flex-1 items-center justify-between gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div>
                  <Suspense fallback={<Skeleton width={80} height={14} />}>
                    <p className={``}>{miniText(12, user?.name || "")}</p>
                  </Suspense>
                  <Suspense fallback={<Skeleton width={80} height={12} />}>
                    <p className="text-xs font-normal text-gray-500">
                      {miniText(15, user?.email || "")}
                    </p>
                  </Suspense>
                </div>

                <div className="flex-center size-7 rounded-md p-1 bg-gray-500/5">
                  <BiChevronRight size={14} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {profileMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 bottom-0 -right-3 translate-x-full bg-white shadow-xl rounded-xl overflow-hidden min-w-[160px]"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <Suspense fallback={<Skeleton width={80} height={14} />}>
                    <p className={``}>{user?.name || ""}</p>
                  </Suspense>
                  <Suspense fallback={<Skeleton width={100} height={12} />}>
                    <p className="text-xs font-normal text-gray-500">
                      {user?.email || ""}
                    </p>
                  </Suspense>
                </div>

                {/* Logout button */}
                <button
                  onClick={() => {
                    setProfileMenu(false);
                    setLogoutPrompt(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <BiLogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default SideBar;