import React from "react";
import { motion } from "framer-motion";
import { Fleur_De_Leah } from "next/font/google";
import { BiPlus, BiX } from "react-icons/bi";

interface Props {
  onClose: () => void;
  onInputChange: (e: string) => void;
  handleCreateHabit: () => void;
}

const font = Fleur_De_Leah({ subsets: ["latin"], weight: "400" });

const AddHabit = ({ onClose, onInputChange, handleCreateHabit }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="z-20 absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-xs flex-center rounded-lg"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="flex items-start gap-3"
      >
        <div className="bg-white p-3 rounded-xl flex flex-col gap-3">
          <div>
            <h1
              className={`bg-clip-text bg-gradient text-color-primary h1 text-[3em] leading-14 ${font.className}`}
            >
              Add Habit
            </h1>
            <p className="text-[.8em] text-black">
              Add a habit you want to track
            </p>
          </div>

          <form
            onSubmit={handleCreateHabit}
            className="flex items-center justify-between"
          >
            <input
              type="text"
              placeholder="Habit name"
              className="border border-color-primary p-1 px-2 rounded-lg mr-3 bg-glass-gradient"
              onChange={(e) => onInputChange(e.target.value)}
            />
            <button
              type="submit"
              className="py-1 px-3 text-white rounded-lg bg-gradient hover:text-color-tertiary transition flex-center"
            >
              <BiPlus />
            </button>
          </form>
        </div>

        <button
          className="bg-white p-1 rounded-xl flex-center text-red-500"
          onClick={onClose}
        >
          <BiX />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AddHabit;
