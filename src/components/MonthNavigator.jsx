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

        <div className="bg-[#222] border-[0.1px] border-orange-500 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrev}
              disabled={!canGoBack}
              className={`p-2 rounded-lg transition ${
                !canGoBack
                  ? "text-orange-600 cursor-not-allowed opacity-50"
                  : "hover:bg-slate-700 text-orange-500"
              }`}
              title={!canGoBack ? "No earlier habits available" : "Previous month"}
            >
              <ChevronLeft size={22} />
            </button>
            <div className="text-center">
              <h2 className="text-2xl saira text-[#F6E7C6] font-bold">
                {MONTHS[month - 1]}
              </h2>
              <p className="text-sm saira text-[#F6E7C6]">{year}</p>
            </div>
            <button
              onClick={onNext}
              className="p-2 hover:bg-slate-700 rounded-lg transition text-orange-500"
              title="Next month"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      ) : (

        <div>
          <div className="text-center text-lg text-[#F6E7C6] mb-3 saira tracking-wide">
            {year}
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <div className="grid grid-cols-12 gap-2 min-w-150">
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
                      py-2 rounded-md text-sm font-medium
                      transition-all duration-200
                      ${
                        isCurrent
                          ? "bg-orange-600 text-white shadow "
                          : isDisabled
                          ? "bg-slate-900 text-slate-600 cursor-not-allowed opacity-50"
                          : isFuture
                          ? "bg-[#222] text-slate-500 hover:border-[#ff7b10] border-[0.1px] border-[#424242]"
                          : "bg-[#222] text-[#F6E7C6] hover:bg-slate-900 border-[0.1px] border-[#ff7b10] hover:text-white"
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