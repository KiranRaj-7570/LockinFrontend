const DayCell = ({ day, active, onClick, disabled, isToday }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        aspect-square w-8 sm:w-9 rounded-md text-[12px] saira sm:text-xs font-medium
        flex items-center justify-center
        transition-all duration-200 ease-out
        border select-none
        ${
          disabled
            ? "bg-[#222] text-[#898378] border-slate-800 cursor-not-allowed"
            : active
            ? " bg-green-500 text-black border-black shadow-lg  hover:scale-[1.04]"
            : isToday
            ? "bg-[#ffffff] text-[#222] border-2 border-black hover:scale-[1.04]"
            : "bg-[#F6E7C6] text-[#222] hover:scale-[1.04] border-black"
        }
      `}
    >
      {day}
    </button>
  );
};

export default DayCell;
