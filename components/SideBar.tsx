import { AnimatePresence, motion } from "framer-motion";
import { Fleur_De_Leah } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { getUserFromToken, miniText } from "@/lib/utils";
import Image from "next/image";
import {
  BiCheck,
  BiCollapse,
  BiLogOut,
  BiMenu,
  BiUser,
  BiX,
} from "react-icons/bi";
import AreYouSurePrompt from "./modals/AreYouSurePrompt";

const font = Fleur_De_Leah({ subsets: ["latin"], weight: "400" });

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
  const [profilePrompt, setProfilePrompt] = useState(false);
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const { user, logout } = useUserContext();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchHabits = async () => {
      const user = getUserFromToken();
      if (!user) return;
      try {
        const res = await fetch(`/api/habits/get?user_id=${user._id}`);
        if (res.ok) {
          const data = await res.json();
          setHabits(data.habits);
        }
      } catch (err) {
        console.error("SideBar: error fetching habits", err);
      }
    };

    fetchHabits();
  }, []);

  return (
    <>
      <AnimatePresence>
        {logoutPrompt && (
          <AreYouSurePrompt
            title="Are you sure to logout?"
            onClose={() => setLogoutPrompt(false)}
            onDelete={logout}
          />
        )}
      </AnimatePresence>

      {/* profile detail in <mobile */}
      <AnimatePresence>
        {profilePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-15 fixed top-0 left-0 w-full h-full bg-black/50 flex-center rounded-lg"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex items-start gap-3"
            >
              <div className="flex gap-3 items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className={`text-[2em] ${font.className}`}>{user?.name}</p>
                  <p className="text-sm font-normal">{user?.email}</p>
                </div>
                <div className="relative">
                  <div
                    className="hover:bg-gray-500/5 p-2 rounded-lg cursor-pointer flex-center transition"
                    onClick={() => setLogoutPrompt(!logoutPrompt)}
                  >
                    <BiLogOut className="text-2xl" />
                  </div>
                </div>
              </div>
              <button
                className="bg-white p-1 rounded-xl flex-center"
                onClick={() => setProfilePrompt(false)}
              >
                <BiX className="text-2xl" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col justify-between w-68 md:h-full">
        {/* logo and collapse */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="CalHabit Logo"
                width={120}
                height={40}
                className="h-9 w-auto"
              />
            </Link>
            CalHabit
          </div>

          <button className="flex-center size-7 rounded-md p-1 bg-gray-500/5 hover:bg-gray-500/10 transition-all cursor-pointer">
            <BiCollapse size={18} />
          </button>
        </div>
        <div className="mt-5 px-3 py-2 bg-white rounded-2xl shadow-2xl">
          {/* middle: habit summary */}
          {habits && habits.length > 0 && (
            <div className="hidden md:flex flex-col gap-1.5 overflow-y-auto py-3 px-1">
              {habits.map((habit) => {
                const monthDates = habit.dates.filter(
                  (d) =>
                    d.date.year === currentYear &&
                    d.date.month === currentMonth,
                );
                const doneCount = monthDates.filter(
                  (d) => d.status === "done",
                ).length;
                const undoneCount = monthDates.filter(
                  (d) => d.status === "undone",
                ).length;

                const displayName =
                  habit.habit_name.length > 30
                    ? habit.habit_name.slice(0, 30) + "…"
                    : habit.habit_name;

                return (
                  <Link
                    key={habit._id}
                    href={`/habits/${habit._id}`}
                    className="group flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-gray-500/10 hover:bg-gray-500/20 transition-all"
                  >
                    <p className="font-semibold text-sm text-gray-800 group-hover:text-gray-900 transition leading-none">
                      {displayName}
                    </p>
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
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* footer profile */}
        <div className="mt-auto flex items-center justify-between gap-2 px-3 py-2 bg-white rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="flex-center size-10 rounded-full bg-gray-100 border border-gray-900">
              <BiUser size={24} />
            </div>
            <div>
              <p className={`text-md`}>{miniText(10, user?.name)}</p>
              <p className="text-sm font-normal text-gray-500">
                {miniText(10, user?.email)}
              </p>
            </div>
          </div>

          <div className="flex-center size-7 rounded-md p-1 bg-gray-500/5 hover:bg-gray-500/10 transition-all cursor-pointer">
            <BiMenu size={20} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
