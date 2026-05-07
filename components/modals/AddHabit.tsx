import React from "react";
import { motion } from "framer-motion";
import { BiPlus } from "react-icons/bi";

interface Props {
  onClose: () => void;
  onInputChange: (e: string) => void;
  handleCreateHabit: () => void;
}

const AddHabit = ({ onClose, onInputChange, handleCreateHabit }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="z-50 fixed inset-0 w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-color-primary via-color-secondary to-color-tertiary" />

        <div className="p-4 flex flex-col items-center gap-4">
          {/* icon container */}
          <div className="flex-center size-16 rounded-2xl bg-indigo-50 border border-indigo-100 rotate-3">
            <div className="flex-center size-12 rounded-xl bg-gradient-to-br from-color-primary to-color-secondary text-white shadow-lg -rotate-3">
              <BiPlus className="text-3xl" />
            </div>
          </div>

          {/* text content */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              New Habit
            </h3>
            <p className="text-sm text-gray-500 mt-1.5 px-4">
              What activity would you like to start tracking today?
            </p>
          </div>

          {/* input area */}
          <div className="w-full space-y-2">
            <label htmlFor="habit-name" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
              Habit Name
            </label>
            <input
              autoFocus
              id="habit-name"
              type="text"
              placeholder="e.g. Morning Meditation"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-color-primary focus:ring-4 focus:ring-color-primary/10 transition-all outline-none text-gray-700 placeholder:text-gray-300"
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateHabit();
                }
              }}
            />
          </div>

          {/* actions */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateHabit}
              className="cursor-pointer flex-[1.5] px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient hover:opacity-90 active:scale-95 shadow-md shadow-color-primary/20 transition-all"
            >
              Create Habit
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddHabit;

