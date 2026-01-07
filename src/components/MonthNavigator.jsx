import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MonthNavigator = ({
  month,
  year,
  onChange,
  onPrev,
  onNext,
  todayMonth,
  todayYear,
  canGoBack,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mb-8">
      {isMobile ? (
        <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrev}
              disabled={!canGoBack}
              className={`p-2 rounded-lg transition ${
                !canGoBack
                  ? "text-slate-500 cursor-not-allowed opacity-50"
                  : "hover:bg-slate-700 text-orange-400 hover:text-orange-300"
              }`}
              title={!canGoBack ? "No earlier habits available" : "Previous month"}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {MONTHS[month - 1]}
              </h2>
              <p className="text-sm text-slate-400">{year}</p>
            </div>
            <button
              onClick={onNext}
              className="p-2 hover:bg-slate-700 rounded-lg transition text-orange-400 hover:text-orange-300"
              title="Next month"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center text-lg text-slate-300 mb-4 font-semibold tracking-wide">
            {year}
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <div className="grid grid-cols-12 gap-2 min-w-max">
              {MONTHS.map((label, i) => {
                const m = i + 1;
                const isCurrent = m === month;
                const isFuture = year === todayYear && m > todayMonth;
                const isPast = year < todayYear || (year === todayYear && m < todayMonth);
                const isDisabled = !canGoBack && isPast && !(year === year && m === month);

                return (
                  <button
                    key={label}
                    onClick={() => onChange(m, year)}
                    disabled={isDisabled}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-semibold
                      transition-all duration-200
                      ${
                        isCurrent
                          ? "bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
                          : isDisabled
                          ? "bg-slate-700/30 text-slate-500 cursor-not-allowed opacity-50"
                          : isFuture
                          ? "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 border border-slate-600/30"
                          : "bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700/50 hover:border-slate-600 hover:text-white"
                      }
                    `}
                    title={
                      isDisabled
                        ? "No habits available in this month"
                        : `${label} ${year}`
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthNavigator;