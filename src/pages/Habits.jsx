import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../api/axios";
import DayCell from "../components/DayCell";
import MonthNavigator from "../components/MonthNavigator";
import DonutProgress from "../components/DonutProgress";

/* -------------------- SKELETONS -------------------- */

const DayCellSkeleton = () => (
  <div className="aspect-square rounded-md bg-black/20 animate-pulse" />
);

const HabitSkeleton = () => (
  <div className="bg-linear-to-bl from-orange-600/60 via-orange-600/60 to-orange-500/60 border border-slate-800 rounded-xl p-4 sm:p-6 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div>
        <div className="h-4 w-32 bg-black/30 rounded mb-2" />
        <div className="h-3 w-44 bg-black/20 rounded" />
      </div>
      <div className="h-14 w-14 rounded-full bg-black/30" />
    </div>

    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {Array.from({ length: 31 }).map((_, i) => (
        <DayCellSkeleton key={i} />
      ))}
    </div>
  </div>
);

/* -------------------- MAIN -------------------- */

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

  /* -------------------- FETCH START -------------------- */

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

  /* -------------------- FETCH HABITS -------------------- */

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

  /* -------------------- CREATE HABIT -------------------- */

  const createHabit = async () => {
    if (!newHabit.trim()) return;

    try {
      setAdding(true);
      await api.post("/habits", { name: newHabit.trim() });
      setNewHabit("");

      setLoading(true);
      const res = await api.get(`/habits?month=${month}&year=${year}`);
      setHabits(res.data);
    } catch (err) {
      console.error("Create habit failed", err);
    } finally {
      setAdding(false);
      setLoading(false);
    }
  };

  /* -------------------- TOGGLE DAY -------------------- */

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

  /* -------------------- DELETE -------------------- */

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
      setConfirmOpen(false);
      setHabitToDelete(null);
    }
  };

  /* -------------------- MONTH NAV -------------------- */

  const onPrev = () => {
    if (!canGoBack) return;
    setLoading(true);
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const onNext = () => {
    setLoading(true);
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  /* -------------------- RENDER -------------------- */

  return (
    <div className="min-h-screen bg-linear-to-b from-grey-900 to-grey-800 text-white">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold gugi bg-linear-to-r from-orange-600 to-red-400 bg-clip-text text-transparent mb-2">
            LOCK-IN
          </h1>
          <p className="text-orange-500 font-light saira">
            Build habits, stay locked in.
          </p>
        </div>

        {/* Add habit */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createHabit()}
            placeholder="Add a new habit"
            className="flex-1 px-4 py-3 saira rounded-lg bg-[#F6E7C6] text-[#222]"
          />
          <button
            onClick={createHabit}
            disabled={adding || !newHabit.trim()}
            className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-500 transition flex items-center gap-2"
          >
            <Plus size={18} />
            {adding ? "Adding..." : "Add Habit"}
          </button>
        </div>

        <MonthNavigator
          month={month}
          year={year}
          todayMonth={todayMonth}
          todayYear={todayYear}
          onChange={(m, y) => {
            setLoading(true);
            setMonth(m);
            setYear(y);
          }}
          onPrev={onPrev}
          onNext={onNext}
          canGoBack={canGoBack}
        />

        <h2 className="text-2xl saira font-bold mb-6 text-orange-600">
          I'm going to —
        </h2>

        {/* Skeletons */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <HabitSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && habits.length === 0 && (
          <p className="text-center text-slate-400 py-12">
            No habits yet. Create one to get started!
          </p>
        )}

        {!loading && habits.length > 0 && (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.habitId}
                className="bg-linear-to-bl from-orange-600 via-orange-600 to-orange-500 rounded-xl p-4 sm:p-6"
              >
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#222]">
                      {habit.name}
                    </h3>
                    <p className="text-sm text-[#222]">
                      {habit.completedDays} / {habit.totalDays}
                    </p>
                  </div>
                  <DonutProgress percentage={habit.percentage} />
                </div>

                <div className="flex flex-wrap gap-2">
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

      {/* Delete modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-[#222] rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Delete Habit?
            </h2>
            <p className="text-slate-400 mb-6">
              Delete "{habitToDelete?.name}" permanently?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 bg-[#F6E7C6] text-black py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteHabit}
                className="flex-1 bg-red-600 py-2 rounded-lg"
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
