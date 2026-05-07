import React from "react";

const Skeleton = ({
  width = 30,
  height = 20,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) => {

  return (
    <div
      style={{ height, width }}
      className={`m-1 relative rounded-xl bg-gray-500/25 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"></div>
    </div>
  );
};

export default Skeleton;
