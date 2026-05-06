import React from "react";
import { motion } from "framer-motion";
import { BiLogOut } from "react-icons/bi";

interface Props {
  title: string;
  onClose: () => void;
  onDelete: () => void;
}

const AreYouSurePrompt = ({ title, onClose, onDelete }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="z-20 fixed inset-0 w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-400 via-rose-400 to-orange-300" />

        <div className="p-6 flex flex-col items-center gap-5">
          {/* icon */}
          <div className="flex-center size-14 rounded-full bg-rose-50 border border-rose-100">
            <BiLogOut className="text-2xl text-rose-500" />
          </div>

          {/* text */}
          <div className="text-center">
            <p className="font-semibold text-gray-900 text-base leading-snug">
              {title}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              This action cannot be undone.
            </p>
          </div>

          {/* actions */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all"
            >
              Log out
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AreYouSurePrompt;
