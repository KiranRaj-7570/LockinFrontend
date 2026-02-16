import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, LogOut, Pencil, ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Toast from "@radix-ui/react-toast";
import * as Dialog from "@radix-ui/react-dialog";
import api from "../api/axios";
import DayCell from "../components/DayCell";
import MonthNavigator from "../components/MonthNavigator";
import DonutProgress from "../components/DonutProgress";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input, Button, Progress, Skeleton } from "../components/ui";

/* -------------------- SKELETONS -------------------- */

const HabitSkeleton = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 sm:p-6">
    <div className="flex justify-between items-center mb-6">
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 sm:w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4 sm:w-1/6" />
      </div>
      <Skeleton className="h-14 w-14 rounded-full" />
    </div>
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {Array.from({ length: 14 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg" />
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

  const queryClient = useQueryClient();
  const [month, setMonth] = useState(todayMonth);
  const [year, setYear] = useState(todayYear);
  const [newHabit, setNewHabit] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [editName, setEditName] = useState("");
  const [pendingDays, setPendingDays] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const isCurrentMonth = month === todayMonth && year === todayYear;

  const yesterday = new Date(todayYear, todayMonth - 1, todayDay - 1);
  const isTodayMonth = month === todayMonth && year === todayYear;
  const isYesterdayMonth =
    month === yesterday.getMonth() + 1 && year === yesterday.getFullYear();

  /* -------------------- QUERIES -------------------- */

  const { data: startData } = useQuery({
    queryKey: ["habits", "start"],
    queryFn: async () => {
      const res = await api.get("/habits/start");
      return res.data;
    },
    staleTime: Infinity,
  });

  const startMonth = startData?.startMonth || todayMonth;
  const startYear = startData?.startYear || todayYear;
  const canGoBack = !(year === startYear && month === startMonth);

  const { data: habits = [], isLoading: loading } = useQuery({
    queryKey: ["habits", { month, year }],
    queryFn: async () => {
      const res = await api.get(`/habits?month=${month}&year=${year}`);
      return res.data.data || res.data;
    },
  });

  /* -------------------- MUTATIONS -------------------- */
  const { mutate: createHabit, isPending: adding } = useMutation({
    mutationFn: async () => {
      const res = await api.post("/habits", { name: newHabit.trim() });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        setNewHabit("");
        queryClient.invalidateQueries(["habits", { month, year }]);
      }
    },
    onError: (err) => {
      console.error("Create habit failed", err);
    },
  });

  const handleCreateHabit = () => {
    if (!newHabit.trim()) return;
    createHabit();
  };

  /* -------------------- TOGGLE DAY -------------------- */

  const { mutate: toggleDayMutation } = useMutation({
    mutationFn: async ({ habitId, day }) => {
      const res = await api.patch(`/habits/${habitId}/toggle`, {
        day,
        month,
        year,
      });
      return { habitId, day, data: res.data };
    },
    onMutate: async ({ habitId, day }) => {
      const key = `${habitId}:${day}`;
      setPendingDays((prev) => ({ ...prev, [key]: true }));

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["habits", { month, year }]);

      // Snapshot the previous value
      const previousHabits = queryClient.getQueryData(["habits", { month, year }]);

      // Optimistically update to the new value
      queryClient.setQueryData(["habits", { month, year }], (old) => {
        return old.map((h) => {
          if (h.habitId !== habitId) return h;
          const nextDays = { ...(h.days || {}) };
          const wasActive = !!nextDays[day];
          nextDays[day] = !wasActive;
          const completedDays = Object.values(nextDays).filter(Boolean).length;
          const percentage = Math.round((completedDays / h.totalDays) * 100);
          return { ...h, days: nextDays, completedDays, percentage };
        });
      });

      return { previousHabits, key };
    },
    onSuccess: ({ habitId, day, data }, variables, context) => {
      // Update with real data from server
      queryClient.setQueryData(["habits", { month, year }], (old) => {
        return old.map((h) =>
          h.habitId === habitId
            ? {
              ...h,
              days: data.days,
              completedDays: Object.values(data.days).filter(Boolean).length,
              percentage: Math.round(
                (Object.values(data.days).filter(Boolean).length / h.totalDays) * 100
              ),
            }
            : h
        );
      });

      // Show toast
      const wasActive = context.previousHabits?.find(h => h.habitId === habitId)?.days?.[day];
      setToastMessage(wasActive ? `Day ${day} unmarked` : `Day ${day} completed! 🎉`);
      setToastOpen(true);
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(["habits", { month, year }], context.previousHabits);
      }
      setToastMessage("Failed to update day");
      setToastOpen(true);
    },
    onSettled: (data, error, variables, context) => {
      setPendingDays((prev) => {
        const next = { ...prev };
        delete next[context.key];
        return next;
      });
      queryClient.invalidateQueries(["habits", { month, year }]);
    },
  });

  const toggleDay = (habitId, day) => {
    toggleDayMutation({ habitId, day });
  };

  /* -------------------- DELETE -------------------- */
  const { mutate: deleteHabit } = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/habits/${habitToDelete.habitId}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(["habits", { month, year }]);
      }
    },
    onSettled: () => {
      setConfirmOpen(false);
      setHabitToDelete(null);
    },
  });

  const confirmDeleteHabit = () => {
    if (!habitToDelete) return;
    deleteHabit();
  };

  /* -------------------- EDIT -------------------- */
  const openEdit = (habit) => {
    setHabitToEdit(habit);
    setEditName(habit.name);
    setEditOpen(true);
  };

  const { mutate: editHabit, isPending: updating } = useMutation({
    mutationFn: async () => {
      const res = await api.patch(`/habits/${habitToEdit.habitId}`, {
        name: editName.trim(),
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries(["habits", { month, year }]);
      }
    },
    onSettled: () => {
      setEditOpen(false);
      setHabitToEdit(null);
      setEditName("");
    },
  });

  const confirmEditHabit = () => {
    if (!habitToEdit || !editName.trim()) return;
    editHabit();
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

  /* -------------------- RENDER -------------------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white saira">
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header with Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl gugi sm:text-5xl font-bold bg-linear-to-r from-orange-500 via-red-500 to-orange-400 bg-clip-text text-transparent mb-2">
              LOCK-IN
            </h1>
            <p className="text-orange-400 font-light text-sm sm:text-base">
              Build habits, stay locked in.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={handleLogout}
            title="Logout"
            className="px-3 py-2 sm:px-6 sm:py-3 whitespace-nowrap shrink-0"
          >
            <LogOut size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Logout</span>
          </Button>
        </div>

        {/* Add habit */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <Input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateHabit()}
            placeholder="Add a new habit..."
            disabled={adding}
            className="flex-1"
          />
          <Button
            onClick={handleCreateHabit}
            disabled={adding || !newHabit.trim()}
            className="px-6 py-3 sm:py-4 relative overflow-hidden"
          >
            {adding ? (
              <>
                <Progress className="absolute bottom-0 left-0 h-1 rounded-none bg-white/10" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Habit
              </>
            )}
          </Button>
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
          <Accordion.Root type="multiple" className="space-y-4 sm:space-y-6">
            {habits.map((habit) => (
              <Accordion.Item
                key={habit.habitId}
                value={habit.habitId.toString()}
                className="bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-2xl transition-all duration-200 backdrop-blur-3xl overflow-hidden"
              >
                {/* Collapsed Header - Always Visible */}
                <Accordion.Header>
                  <Accordion.Trigger className="w-full p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-700/20 backdrop-blur-3xl transition-colors group">
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 text-left">
                          {habit.name}
                        </h3>
                        <p className="text-sm text-slate-400 text-left">
                          <span className="text-orange-400 font-medium">
                            {habit.completedDays}
                          </span>
                          {" / "}
                          <span>{habit.totalDays} days</span>
                        </p>
                      </div>
                      <DonutProgress percentage={habit.percentage} />
                    </div>
                    <ChevronDown
                      className="w-5 h-5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>

                {/* Expanded Content - Edit/Delete + Day Cells */}
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => openEdit(habit)}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-300 hover:text-white transition-all duration-200 border border-slate-500/20 hover:border-slate-500/40"
                      >
                        <Pencil size={18} />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setHabitToDelete(habit);
                          setConfirmOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                      >
                        <Trash2 size={18} />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>

                    {/* Day Cells */}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      {Array.from({ length: habit.totalDays }, (_, i) => {
                        const day = i + 1;
                        const isToday = isTodayMonth && day === todayDay;
                        const isYesterday =
                          isYesterdayMonth && day === yesterday.getDate();
                        const disabled = !(isToday || isYesterday);
                        const isPending = !!pendingDays[`${habit.habitId}:${day}`];

                        return (
                          <DayCell
                            key={day}
                            day={day}
                            active={habit.days?.[day]}
                            disabled={disabled}
                            isToday={isCurrentMonth && day === todayDay}
                            isPending={isPending}
                            onClick={
                              !disabled && !isPending
                                ? () => toggleDay(habit.habitId, day)
                                : undefined
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        )}
      </div>

      {/* Delete AlertDialog */}
      <AlertDialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-fadeIn" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl z-50 data-[state=open]:animate-fadeIn">
            <AlertDialog.Title className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
              Delete Habit?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-slate-300 mb-6 text-sm sm:text-base">
              Delete <span className="font-semibold text-white">"{habitToDelete?.name}"</span> permanently? This cannot be undone.
            </AlertDialog.Description>
            <div className="flex flex-col sm:flex-row gap-3">
              <AlertDialog.Cancel asChild>
                <Button variant="secondary" className="flex-1">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  variant="danger"
                  onClick={confirmDeleteHabit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg hover:shadow-red-500/30"
                >
                  Delete
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* Edit Habit Modal */}
      <Dialog.Root open={editOpen} onOpenChange={setEditOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-fadeIn" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl z-50 data-[state=open]:animate-fadeIn">
            <Dialog.Title className="text-xl sm:text-2xl font-bold text-orange-400 mb-2">
              Edit Habit
            </Dialog.Title>
            <Dialog.Description className="text-slate-300 mb-4 text-sm sm:text-base">
              Update the habit name below.
            </Dialog.Description>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmEditHabit()}
              disabled={updating}
              className="w-full mb-5"
              placeholder="Habit name"
              autoFocus
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog.Close asChild>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setHabitToEdit(null);
                    setEditName("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                onClick={confirmEditHabit}
                disabled={updating || !editName.trim()}
                className="flex-1 shadow-lg hover:shadow-orange-500/30 relative overflow-hidden"
              >
                {updating ? (
                  <>
                    <Progress className="absolute bottom-0 left-0 h-1 rounded-none bg-white/10" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Toast Provider */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className="bg-slate-900 border border-orange-500/50 rounded-lg p-4 shadow-lg data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut"
        >
          <Toast.Description className="text-white text-sm font-medium">
            {toastMessage}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-full m-0 list-none z-100" />
      </Toast.Provider>
    </div>
  );
};

export default Habits;

