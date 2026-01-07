const DayCell = ({ day, active, onClick, disabled, isToday }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        aspect-square w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-semibold
        flex items-center justify-center
        transition-all duration-200 ease-out
        select-none 
        ${
          disabled
            ? "bg-slate-700/30 text-slate-500 cursor-not-allowed"
            : active
            ? "bg-linear-to-br from-green-500 to-green-600 text-white border border-green-400/50 shadow-lg shadow-green-500/30 hover:scale-110 active:scale-95"
            : isToday
            ? "bg-orange-500/30 text-orange-300 border-2 border-orange-500 shadow-lg shadow-orange-500/20 hover:scale-110 active:scale-95"
            : "bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-600 hover:scale-110 active:scale-95"
        }
      `}
    >
      {day}
    </button>
  );
};

export default DayCell;