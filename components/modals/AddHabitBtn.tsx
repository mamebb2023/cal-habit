import React from "react";
import { BiPlus } from "react-icons/bi";

interface Props {
  onClick: () => void;
}

const AddHabitBtn = ({ onClick }: Props) => {
  return (
    <div
      className="px-2 py-1.5 flex gap-1.5 items-center bg-gradient-to-r from-color-primary via-color-secondary to-color-tertiary hover:bg-gray-500/10 rounded-lg cursor-pointer transition group"
      onClick={onClick}
    >
      <div className="flex-center bg-white rounded-full border border-white transition group-hover:bg-transparent">
        <BiPlus className="text-color-primary group-hover:text-white" />
      </div>
      <p className={`text-[.72em] text-white`}>New Habit</p>
    </div>
  );
};

export default AddHabitBtn;
