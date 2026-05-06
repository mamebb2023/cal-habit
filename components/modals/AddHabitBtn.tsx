import React from "react";
import { BiPlus } from "react-icons/bi";

interface Props {
  onClick: () => void;
}

const AddHabitBtn = ({ onClick }: Props) => {
  return (
    <div
      className="px-2 py-1.5 flex gap-1.5 items-center bg-gradient hover:bg-gray-500/10 rounded-lg cursor-pointer transition group"
      onClick={onClick}
    >
      <div className="flex-center text-white border border-white bg-white rounded-full size-4 transition group-hover:bg-transparent p-2">
        <BiPlus className="text-color-primary group-hover:text-white" />
      </div>
      <p className={`text-[.72em]`}>New Habit</p>
    </div>
  );
};

export default AddHabitBtn;
