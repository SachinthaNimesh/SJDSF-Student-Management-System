import { useNavigate } from "react-router-dom";
import {
  X,
  Clock,
  Users,
  Smile,
  Frown,
  Meh,
  Search,
  Home,
  Building2,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCardService } from "../api/getCard";

type StatusFilter = "all" | "in" | "out" | "home" | "attention";

const Dashboard = () => {
  const navigate = useNavigate();
  const { getCards } = useCardService();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    setLoading(true);
    getCards()
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
  }, []);

  const safeEmployees = Array.isArray(employees) ? employees : [];

  // Helper to determine checked in/out/arrived home status for today
  function getStatusForToday(employee: any) {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const checkedInRaw = employee.check_in_date_time;
    const checkedOutRaw = employee.check_out_date_time;
    const arrivedHomeRaw = employee.arrived_home_date_time;

    const ZERO_TIMESTAMP = "0001-01-01";
    const isZeroTimestamp = (val: any) =>
      typeof val === "string" && val.startsWith(ZERO_TIMESTAMP);

    let checkedInDate = checkedInRaw ? new Date(checkedInRaw) : null;
    let checkedOutDate = checkedOutRaw ? new Date(checkedOutRaw) : null;
    let arrivedHomeDate = arrivedHomeRaw ? new Date(arrivedHomeRaw) : null;

    const isCheckedInToday =
      checkedInDate && checkedInDate.toISOString().slice(0, 10) === todayStr;
    const isCheckedOutToday =
      checkedOutDate && checkedOutDate.toISOString().slice(0, 10) === todayStr;
    const isArrivedHomeToday =
      arrivedHomeDate && arrivedHomeDate.toISOString().slice(0, 10) === todayStr;

    // 1. Arrived Home
    if (arrivedHomeRaw && !isZeroTimestamp(arrivedHomeRaw) && isArrivedHomeToday) {
      return {
        key: "home",
        label: "Arrived Home",
        statusColor: "bg-purple-100 text-purple-800 border-purple-200",
        dotColor: "bg-purple-600",
      };
    }

    // 2. Checked Out (In transit)
    if (checkedOutRaw && !isZeroTimestamp(checkedOutRaw) && isCheckedOutToday) {
      return {
        key: "out",
        label: "In Transit / Checked Out",
        statusColor: "bg-amber-100 text-amber-800 border-amber-200",
        dotColor: "bg-amber-500",
      };
    }

    // 3. Checked In (In workplace)
    if (
      isCheckedInToday &&
      (!checkedOutRaw || isZeroTimestamp(checkedOutRaw))
    ) {
      return {
        key: "in",
        label: "In Workplace",
        statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
        dotColor: "bg-emerald-500",
      };
    }

    // 4. Not in
    return {
      key: "notin",
      label: "Not Checked In",
      statusColor: "bg-gray-100 text-gray-700 border-gray-200",
      dotColor: "bg-gray-400",
    };
  }

  // Filter employees based on search query and active filter tab
  const filteredEmployees = safeEmployees.filter((employee) => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const employeeId = String(employee.student_id).toLowerCase();
    const employer = (employee.employer_name || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      fullName.includes(query) ||
      employeeId.includes(query) ||
      employer.includes(query);

    if (!matchesSearch) return false;

    const statusObj = getStatusForToday(employee);
    if (activeFilter === "all") return true;
    if (activeFilter === "in") return statusObj.key === "in";
    if (activeFilter === "out") return statusObj.key === "out";
    if (activeFilter === "home") return statusObj.key === "home";
    if (activeFilter === "attention") return employee.emotion === "sad";

    return true;
  });

  // Sort employees: Attention needed (sad) first, then neutral, then happy
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const moodPriority: Record<string, number> = { sad: 1, neutral: 2, happy: 3 };
    return (moodPriority[a.emotion] || 4) - (moodPriority[b.emotion] || 4);
  });

  // Calculate statistics
  const totalEmployees = safeEmployees.length;
  const checkedInEmployees = safeEmployees.filter(
    (emp) => getStatusForToday(emp).key === "in"
  ).length;
  const inTransitEmployees = safeEmployees.filter(
    (emp) => getStatusForToday(emp).key === "out"
  ).length;
  const arrivedHomeEmployees = safeEmployees.filter(
    (emp) => getStatusForToday(emp).key === "home"
  ).length;
  const attentionEmployees = safeEmployees.filter(
    (emp) => emp.emotion === "sad"
  ).length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-20 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const currentDateFormatted = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3 border border-white/20">
            Shiranee Joseph de Saram Foundation
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Trainee Wellbeing Hub
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            • {currentDateFormatted}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-blue-200 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-blue-200/70 border border-white/25 rounded-2xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/20 backdrop-blur-md transition-all shadow-inner"
            placeholder="Search trainee, ID, or employer..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3.5 text-blue-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4-Card Live Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Trainees
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {totalEmployees}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Active in foundation program
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                In Workplace
              </p>
              <p className="text-3xl font-black text-emerald-700 mt-1">
                {checkedInEmployees}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-600 font-semibold">
            {totalEmployees > 0
              ? `${Math.round((checkedInEmployees / totalEmployees) * 100)}% attendance today`
              : "0%"}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                In Transit (Checked Out)
              </p>
              <p className="text-3xl font-black text-amber-700 mt-1">
                {inTransitEmployees}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-600 font-medium">
            Travelling home from workplace
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                Arrived Home Safely
              </p>
              <p className="text-3xl font-black text-purple-700 mt-1">
                {arrivedHomeEmployees}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-purple-600 font-medium">
            Confirmed by parent PIN
          </div>
        </div>
      </div>

      {/* Filter Tabs / Quick View Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeFilter === "all"
            ? "bg-slate-900 text-white shadow-sm"
            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
        >
          All Trainees ({totalEmployees})
        </button>
        <button
          onClick={() => setActiveFilter("in")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeFilter === "in"
            ? "bg-emerald-600 text-white shadow-sm"
            : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200"
            }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          In Workplace ({checkedInEmployees})
        </button>
        <button
          onClick={() => setActiveFilter("out")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeFilter === "out"
            ? "bg-amber-600 text-white shadow-sm"
            : "bg-white text-slate-600 hover:bg-amber-50 border border-slate-200"
            }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          In Transit ({inTransitEmployees})
        </button>
        <button
          onClick={() => setActiveFilter("home")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeFilter === "home"
            ? "bg-purple-600 text-white shadow-sm"
            : "bg-white text-slate-600 hover:bg-purple-50 border border-slate-200"
            }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          Arrived Home ({arrivedHomeEmployees})
        </button>
        {attentionEmployees > 0 && (
          <button
            onClick={() => setActiveFilter("attention")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeFilter === "attention"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            Needs Attention ({attentionEmployees})
          </button>
        )}
      </div>

      {/* Trainees Grid */}
      {sortedEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No trainees found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No students matching "${searchQuery}". Try clearing search.`
              : "No trainees match the selected status filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEmployees.map((employee) => {
            const status = getStatusForToday(employee);
            const initials = `${employee.first_name?.[0] || ""}${employee.last_name?.[0] || ""
              }`.toUpperCase();

            const isAttention = employee.emotion === "sad";

            return (
              <div
                key={employee.student_id}
                onClick={() => navigate(`/employee/${employee.student_id}`)}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${isAttention
                  ? "border-rose-200 shadow-rose-50 shadow-md ring-1 ring-rose-300"
                  : "border-slate-100 shadow-sm hover:border-indigo-100"
                  }`}
              >
                <div>
                  {/* Top card row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                        {initials || "ST"}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                          {employee.first_name} {employee.last_name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">
                          ID: #{employee.student_id}
                        </span>
                      </div>
                    </div>

                    {/* Mood indicator */}
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor:
                          employee.emotion === "happy"
                            ? "#ecfdf5"
                            : employee.emotion === "sad"
                              ? "#fff1f2"
                              : "#f1f5f9",
                        color:
                          employee.emotion === "happy"
                            ? "#047857"
                            : employee.emotion === "sad"
                              ? "#be123c"
                              : "#475569",
                      }}
                    >
                      {employee.emotion === "happy" && <Smile className="w-3.5 h-3.5" />}
                      {employee.emotion === "neutral" && <Meh className="w-3.5 h-3.5" />}
                      {employee.emotion === "sad" && <Frown className="w-3.5 h-3.5" />}
                      <span className="capitalize">{employee.emotion || "No log"}</span>
                    </div>
                  </div>

                  {/* Status Badge Pill */}
                  <div className="mt-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${status.statusColor}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
                      {status.label}
                    </div>
                  </div>

                  {/* Employer Info */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center text-slate-600 gap-2 font-medium">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {employee.employer_name || "Unassigned Workplace"}
                      </span>
                    </div>
                    {employee.check_in_time && (
                      <div className="flex items-center text-slate-500 gap-2 font-medium">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          Hours: {employee.check_in_time.slice(0, 5)} -{" "}
                          {employee.check_out_time ? employee.check_out_time.slice(0, 5) : "--:--"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-indigo-600 group">
                  <span>View Trainee Dossier</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
