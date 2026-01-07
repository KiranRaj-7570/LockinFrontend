import { useEffect, useState, useContext } from "react";
import { Plus, Trash2, LogOut } from "lucide-react";
import api from "../api/axios";
import DayCell from "../components/DayCell";
import MonthNavigator from "../components/MonthNavigator";
import DonutProgress from "../components/DonutProgress";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* -------------------- SKELETONS -------------------- */

const DayCellSkeleton = () => (
  <div className="aspect-square rounded-lg bg-slate-700/30 animate-pulse" />
);

const HabitSkeleton = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 sm:p-6 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="flex-1">
        <div className="h-5 w-32 bg-slate-700/50 rounded-lg mb-2" />
        <div className="h-4 w-24 bg-slate-700/30 rounded-lg" />
      </div>
      <div className="h-16 w-16 rounded-full bg-slate-700/50" />
    </div>
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 31 }).map((_, i) => (
        <DayCellSkeleton key={i} />
      ))}
    </div>
  </div>
);

/* -------------------- MAIN -------------------- */

const Habits = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

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
        // Fallback to current month if fails
        setStartMonth(todayMonth);
        setStartYear(todayYear);
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
        setHabits(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to fetch habits", err);
        setHabits([]);
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
      const res = await api.post("/habits", { name: newHabit.trim() });

      if (res.data.success) {
        setNewHabit("");
        // Refetch habits for current month
        setLoading(true);
        const habitsRes = await api.get(`/habits?month=${month}&year=${year}`);
        setHabits(habitsRes.data.data || habitsRes.data);
      }
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
      const res = await api.delete(`/habits/${habitToDelete.habitId}`);
      if (res.data.success) {
        setHabits((prev) =>
          prev.filter((h) => h.habitId !== habitToDelete.habitId)
        );
      }
    } catch (err) {
      console.error("Failed to delete habit", err);
    } finally {
      setConfirmOpen(false);
      setHabitToDelete(null);
    }
  };

  /* -------------------- LOGOUT -------------------- */

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header with Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-orange-500 via-red-500 to-orange-400 bg-clip-text text-transparent mb-2">
              LOCK-IN
            </h1>
            <p className="text-orange-400 font-light text-sm sm:text-base">
              Build habits, stay locked in.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/60 rounded-lg transition-all duration-200 text-red-400 hover:text-red-300 font-medium text-xs sm:text-base whitespace-nowrap shrink-0"
            title="Logout"
          >
            <LogOut size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline sm:inline">Logout</span>
          </button>
        </div>

        {/* Add habit */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createHabit()}
            placeholder="Add a new habit..."
            disabled={adding}
            className="flex-1 px-4 py-3 sm:py-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-white placeholder-slate-500 text-sm sm:text-base transition-all duration-200 disabled:opacity-50 outline-0"
          />
          <button
            onClick={createHabit}
            disabled={adding || !newHabit.trim()}
            className="px-6 py-3 sm:py-4 rounded-lg bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm sm:text-base shadow-lg hover:shadow-orange-500/30"
          >
            <Plus size={18} />
            <span>{adding ? "Adding..." : "Add Habit"}</span>
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

        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-orange-400">
          My Goals
        </h2>

        {/* Skeletons */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <HabitSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && habits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-base sm:text-lg mb-4">
              No habits yet. Create one to get started!
            </p>
            <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-400 text-sm">
                Start by adding your first habit above
              </p>
            </div>
          </div>
        )}

        {/* Habits List */}
        {!loading && habits.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {habits.map((habit) => (
              <div
                key={habit.habitId}
                className="bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-4 sm:p-6 transition-all duration-200 backdrop-blur-sm"
              >
                {/* Habit Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                      {habit.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      <span className="text-orange-400 font-medium">
                        {habit.completedDays}
                      </span>
                      {" / "}
                      <span>{habit.totalDays} days</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <DonutProgress percentage={habit.percentage} />
                    <button
                      onClick={() => {
                        setHabitToDelete(habit);
                        setConfirmOpen(true);
                      }}
                      className="p-2 sm:p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                      title="Delete habit"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Day Cells */}
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

      {/* Delete Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fadeIn">
            <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
              Delete Habit?
            </h2>
            <p className="text-slate-300 mb-6 text-sm sm:text-base">
              Delete{" "}
              <span className="font-semibold text-white">
                "{habitToDelete?.name}"
              </span>{" "}
              permanently? This cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteHabit}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-red-500/30"
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