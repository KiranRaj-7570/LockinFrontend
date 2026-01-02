import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../api/axios";
import DayCell from "../components/DayCell";
import MonthNavigator from "../components/MonthNavigator";
import DonutProgress from "../components/DonutProgress";

const Habits = () => {
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  const [month, setMonth] = useState(todayMonth);
  const [year, setYear] = useState(todayYear);

  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startMonth, setStartMonth] = useState(null);
  const [startYear, setStartYear] = useState(null);

  const isCurrentMonth = month === todayMonth && year === todayYear;

  const isPastMonth =
    year < todayYear || (year === todayYear && month < todayMonth);

  const isFutureMonth =
    year > todayYear || (year === todayYear && month > todayMonth);

  const canGoBack = !(year === startYear && month === startMonth);


  useEffect(() => {
    const fetchStartMonth = async () => {
      try {
        const res = await api.get("/habits/start");
        setStartMonth(res.data.startMonth);
        setStartYear(res.data.startYear);
      } catch (err) {
        console.error("Failed to fetch start month", err);
      }
    };

    fetchStartMonth();
  }, []);


  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/habits?month=${month}&year=${year}`);
        setHabits(res.data);
      } catch (err) {
        console.error("Failed to fetch habits", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [month, year]);


  const createHabit = async () => {
    if (!newHabit.trim()) return;

    try {
      setAdding(true);
      await api.post("/habits", { name: newHabit.trim() });

      setNewHabit("");

      const res = await api.get(`/habits?month=${month}&year=${year}`);
      setHabits(res.data);
    } catch (err) {
      console.error("Create habit failed", err);
    } finally {
      setAdding(false);
    }
  };

  const toggleDay = async (habitId, day) => {
    try {
      const res = await api.patch(`/habits/${habitId}/toggle`, {
        day,
        month,
        year,
      });

      setHabits((prev) =>
        prev.map((h) =>
          h.habitId === habitId
            ? {
                ...h,
                days: res.data.days,
                completedDays: Object.values(res.data.days).filter(Boolean)
                  .length,
                percentage: Math.round(
                  (Object.values(res.data.days).filter(Boolean).length /
                    h.totalDays) *
                    100
                ),
              }
            : h
        )
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const openDeleteConfirm = (habit) => {
    setHabitToDelete(habit);
    setConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setConfirmOpen(false);
    setHabitToDelete(null);
  };

  const confirmDeleteHabit = async () => {
    if (!habitToDelete) return;

    try {
      await api.delete(`/habits/${habitToDelete.habitId}`);
      setHabits((prev) =>
        prev.filter((h) => h.habitId !== habitToDelete.habitId)
      );
    } catch (err) {
      console.error("Failed to delete habit", err);
    } finally {
      closeDeleteConfirm();
    }
  };

  const onPrev = () => {
    if (!canGoBack) return;
    
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const onNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#292929] via-[#292929] to-[#141414] text-white">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold gugi bg-linear-to-r from-orange-600 to-red-400 bg-clip-text text-transparent mb-2">
            LOCK-IN
          </h1>
          <p className="text-orange-400 font-light saira">Build habits, stay locked in.</p>
        </div>
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && createHabit()}
            placeholder="Add a new habit (e.g., Workout, Read)"
            className="flex-1 px-4 py-3 saira rounded-lg bg-[#F6E7C6] border border-black-700 text-[#222222] placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          <button
            onClick={createHabit}
            disabled={adding || !newHabit.trim()}
            className="px-6 py-3 saira rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-80 disabled:hover:bg-orange-600 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">{adding ? "Adding..." : "Add Habit"}</span>
            <span className="sm:hidden">{adding ? "..." : "Add"}</span>
          </button>
        </div>

     
        <MonthNavigator
          month={month}
          year={year}
          todayMonth={todayMonth}
          todayYear={todayYear}
          onChange={(m, y) => {
            setMonth(m);
            setYear(y);
          }}
          onPrev={onPrev}
          onNext={onNext}
          canGoBack={canGoBack}
        />

  
        <h2 className="text-2xl saira font-bold mb-6 text-orange-500">Im Going to-</h2>

   
        {!loading && habits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg saira">No habits yet. Create one to get started!</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading habits...</p>
          </div>
        )}

      
        {!loading && habits.length > 0 && (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.habitId}
                className="bg-orange-500 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6 hover:border-slate-700 transition"
              >
            
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg saira font-semibold text-[#222]">{habit.name}</h3>
                    <p className="text-sm text-[#222] mt-1 saira">
                      {habit.completedDays} of {habit.totalDays} days completed
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <DonutProgress percentage={habit.percentage} />
                    <button
                      onClick={() => openDeleteConfirm(habit)}
                      disabled={isFutureMonth}
                      className={`p-2 rounded-lg transition ${
                        isFutureMonth
                          ? "text-slate-800 cursor-not-allowed opacity-80"
                          : "text-[#222] hover:text-red-900 bg-red-500/30"
                      }`}
                      title={isFutureMonth ? "Cannot delete habits in future months" : "Delete habit"}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {Array.from({ length: habit.totalDays }, (_, i) => {
                    const day = i + 1;

                    const isFutureDay = isCurrentMonth && day > todayDay;

                    const disabled =
                      isPastMonth || isFutureMonth || isFutureDay;

                    return (
                      <DayCell
                        key={day}
                        day={day}
                        active={habit.days?.[day]}
                        disabled={disabled}
                        isToday={isCurrentMonth && day === todayDay}
                        onClick={
                          !disabled
                            ? () => toggleDay(habit.habitId, day)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-2">Delete Habit?</h2>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete "{habitToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteHabit}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;