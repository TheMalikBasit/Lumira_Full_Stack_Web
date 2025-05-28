import React from "react";

const Loading = () => {
  return (
    <div className="h-full bg-gradient-radial from-[#3C4B57] to-[#1C262B] bg-[radial-gradient(circle_farthest-corner_at_center,_#3C4B57_0%,_#1C262B_100%)]">
      <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full perspective-[800px]">
        <div className="absolute w-full h-full rounded-full box-border border-b-[3px] border-[#EFEFFA] animate-rotate-one"></div>
        <div className="absolute w-full h-full rounded-full box-border border-r-[3px] border-[#EFEFFA] animate-rotate-two"></div>
        <div className="absolute w-full h-full rounded-full box-border border-t-[3px] border-[#EFEFFA] animate-rotate-three"></div>
      </div>
    </div>
  );
};

export default Loading;
