import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Building2,
  Calendar,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Home,
  Briefcase,
  Smile,
  Meh,
  Frown,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Activity,
} from "lucide-react";
import { Card } from "../components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getTraineeProfile,
  TraineeProfileResponse,
  StudentInfo,
  Mood,
} from "../api/getEmployeeSummary";
import apiClient from "../lib/axios";
import { appConfig } from "../config/configs";

type DetailTab = "wellbeing" | "attendance" | "locations";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TraineeProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyFeedbacks, setDailyFeedbacks] = useState<any[]>([]);
  const [locationLogs, setLocationLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<DetailTab>("wellbeing");
  const [showPin, setShowPin] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getTraineeProfile(Number(id))
      .then((profileData) => {
        setProfile(profileData);
      })
      .catch((error) => {
        console.error("Error fetching trainee profile:", error);
      })
      .finally(() => setLoading(false));

    // Fetch daily feedbacks
    apiClient
      .get(`/student-feedbacks?student_id=${id}`, {
        headers: { "api-key": appConfig.VITE_API_KEY },
      })
      .then((res) => setDailyFeedbacks(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching feedbacks:", err));

    // Fetch location history (30 days)
    apiClient
      .get(`/student/${id}/locations`, {
        headers: { "api-key": appConfig.VITE_API_KEY },
      })
      .then((res) => setLocationLogs(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching locations:", err));
  }, [id]);

  const studentInfo: StudentInfo | undefined = profile?.student_info;
  const parentPin = studentInfo?.parent_pin || "1234";

  const handleCopyPin = () => {
    navigator.clipboard.writeText(parentPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // Determine Today's Journey from recent_attendance
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecord = (profile?.recent_attendance ?? []).find((a) => {
    if (!a.actual_check_in) return false;
    return a.actual_check_in.slice(0, 10) === todayStr;
  });

  const checkedInToday = !!todayRecord?.actual_check_in;
  const checkedInTimeStr = todayRecord?.actual_check_in
    ? new Date(todayRecord.actual_check_in).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const checkedOutToday =
    !!todayRecord?.actual_check_out &&
    !todayRecord.actual_check_out.startsWith("0001-01-01");
  const checkedOutTimeStr = checkedOutToday
    ? new Date(todayRecord!.actual_check_out!).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const arrivedHomeToday =
    !!todayRecord?.arrived_home_date_time &&
    !todayRecord.arrived_home_date_time.startsWith("0001-01-01");
  const arrivedHomeTimeStr = arrivedHomeToday
    ? new Date(todayRecord!.arrived_home_date_time!).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // Emotional Trend Data
  const emotionMap: Record<string, number> = { sad: 0, neutral: 1, happy: 2 };
  const emotionalData =
    (profile?.recent_moods ?? [])
      .map((m: Mood) => ({
        date: m.recorded_at ? m.recorded_at.slice(5, 10) : "",
        fullDate: m.recorded_at ? new Date(m.recorded_at).toLocaleDateString() : "",
        emotion: m.emotion,
        value: emotionMap[m.emotion] ?? 1,
        recorded_at: m.recorded_at,
      }))
      .sort((a, b) => (a.recorded_at > b.recorded_at ? 1 : -1)) || [];

  // Initials for avatar
  const initials = studentInfo
    ? `${studentInfo.first_name?.[0] || ""}${studentInfo.last_name?.[0] || ""}`.toUpperCase()
    : "ST";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500">Loading Trainee Dossier...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-12">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trainee Overview
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Shiranee Joseph de Saram Foundation</span>
            <span>•</span>
            <span className="font-semibold text-blue-600">Instructor Dossier</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* Trainee Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-md flex-shrink-0">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {studentInfo?.first_name} {studentInfo?.last_name}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                    ID: #{id}
                  </span>
                  {studentInfo?.gender && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {studentInfo.gender}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Employer:</span>
                  <span className="font-semibold text-slate-900">
                    {studentInfo?.employer_name || "Unassigned"}
                  </span>
                </div>

                {studentInfo?.remarks && (
                  <p className="mt-2 text-xs text-slate-500 max-w-2xl bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 text-amber-900">
                    <span className="font-semibold">Instructor Note: </span>
                    {studentInfo.remarks}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Contacts & Parent PIN */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
              {/* Parent PIN Card */}
              <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
                      Parent Home PIN
                    </span>
                    <span className="text-lg font-mono font-bold text-indigo-950 tracking-widest">
                      {showPin ? parentPin : "••••"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100/60 rounded-md transition-colors"
                    title={showPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopyPin}
                    className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100/60 rounded-md transition-colors"
                    title="Copy PIN"
                  >
                    {copiedPin ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Direct Call Guardian Button */}
              {studentInfo?.contact_number_guardian && (
                <a
                  href={`tel:${studentInfo.contact_number_guardian}`}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Guardian: {studentInfo.contact_number_guardian}
                </a>
              )}

              {/* Direct Call Trainee Button */}
              {studentInfo?.contact_number && (
                <a
                  href={`tel:${studentInfo.contact_number}`}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Trainee: {studentInfo.contact_number}
                </a>
              )}
            </div>
          </div>

          {/* Today's Journey Stepper */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Today's Safety & Attendance Progress
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Check In */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  checkedInToday
                    ? "bg-emerald-50/70 border-emerald-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        checkedInToday
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      1
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      Work Check-In
                    </span>
                  </div>
                  {checkedInToday && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Confirmed
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 pl-8">
                  {checkedInToday
                    ? `Checked in at ${checkedInTimeStr}`
                    : "Not yet checked in today"}
                </p>
              </div>

              {/* Step 2: Check Out */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  checkedOutToday
                    ? "bg-amber-50/70 border-amber-200"
                    : checkedInToday
                    ? "bg-blue-50/50 border-blue-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        checkedOutToday
                          ? "bg-amber-600 text-white"
                          : checkedInToday
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      2
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      Work Check-Out
                    </span>
                  </div>
                  {checkedOutToday && (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      In Transit
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 pl-8">
                  {checkedOutToday
                    ? `Completed work at ${checkedOutTimeStr}`
                    : checkedInToday
                    ? "Currently working on site"
                    : "Awaiting check-in"}
                </p>
              </div>

              {/* Step 3: Arrived Safely Home */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  arrivedHomeToday
                    ? "bg-indigo-50/80 border-indigo-200"
                    : checkedOutToday
                    ? "bg-amber-50/30 border-dashed border-amber-300"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        arrivedHomeToday
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      3
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      Arrived Safely Home
                    </span>
                  </div>
                  {arrivedHomeToday && (
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Parent Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 pl-8">
                  {arrivedHomeToday
                    ? `Parent confirmed at ${arrivedHomeTimeStr}`
                    : checkedOutToday
                    ? "En route — parent PIN confirmation pending"
                    : "Awaiting end of workday"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("wellbeing")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "wellbeing"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smile className="w-4 h-4" />
            Wellbeing & Feedback ({dailyFeedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "attendance"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            Attendance History ({(profile?.recent_attendance ?? []).length})
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "locations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MapPin className="w-4 h-4" />
            Location Trail ({locationLogs.length})
          </button>
        </div>

        {/* TAB 1: Wellbeing & Daily Feedbacks */}
        {activeTab === "wellbeing" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emotional Trend Chart */}
            <Card className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Emotional Wellbeing Trend
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daily mood checks logged on mobile check-in
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Smile className="w-3.5 h-3.5" /> Happy
                  </span>
                  <span className="flex items-center gap-1 text-amber-700">
                    <Meh className="w-3.5 h-3.5" /> Neutral
                  </span>
                  <span className="flex items-center gap-1 text-rose-700">
                    <Frown className="w-3.5 h-3.5" /> Sad
                  </span>
                </div>
              </div>

              {emotionalData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
                  <Meh className="w-8 h-8 mb-2 opacity-50" />
                  No mood entries logged yet.
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={emotionalData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        className="text-xs text-slate-400"
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, 2]}
                        ticks={[0, 1, 2]}
                        tickFormatter={(value) => {
                          if (value === 2) return "Happy";
                          if (value === 1) return "Neutral";
                          return "Sad";
                        }}
                        className="text-xs text-slate-400"
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-lg space-y-1">
                                <p className="font-semibold">{data.fullDate}</p>
                                <p className="capitalize">
                                  Mood: <span className="font-bold">{data.emotion}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#2563eb" }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Daily Check-Out Feedbacks */}
            <Card className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Daily Departure Feedbacks
                  </h3>
                  <p className="text-xs text-slate-500">
                    Trainee reflections shared at checkout
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                  {dailyFeedbacks.length} Entries
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
                {dailyFeedbacks.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                    No check-out feedback submitted yet.
                  </div>
                ) : (
                  dailyFeedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-blue-700">
                          Checkout Note
                        </span>
                        <span>
                          {fb.submitted_at
                            ? new Date(fb.submitted_at).toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-normal">
                        "{fb.feedback_text}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: Attendance History */}
        {activeTab === "attendance" && (
          <Card className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent Attendance Records
                </h3>
                <p className="text-xs text-slate-500">
                  Daily timestamps including work arrival, departure, and parent home arrival
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    DATE
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    SCHEDULED
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    CHECK IN
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    CHECK OUT
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    ARRIVED HOME
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    JOURNEY STATUS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(profile?.recent_attendance ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  (profile?.recent_attendance ?? []).map((rec, i) => {
                    const checkInDate = rec.actual_check_in
                      ? new Date(rec.actual_check_in)
                      : null;
                    const checkOutDate =
                      rec.actual_check_out &&
                      !rec.actual_check_out.startsWith("0001-01-01")
                        ? new Date(rec.actual_check_out)
                        : null;
                    const homeDate =
                      rec.arrived_home_date_time &&
                      !rec.arrived_home_date_time.startsWith("0001-01-01")
                        ? new Date(rec.arrived_home_date_time)
                        : null;

                    return (
                      <TableRow key={i} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium text-slate-900 text-sm">
                          {checkInDate
                            ? checkInDate.toLocaleDateString([], {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {rec.scheduled_check_in?.slice(0, 5) || "-"} -{" "}
                          {rec.scheduled_check_out?.slice(0, 5) || "-"}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-emerald-700">
                          {checkInDate
                            ? checkInDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-amber-700">
                          {checkOutDate
                            ? checkOutDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-indigo-700">
                          {homeDate
                            ? homeDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {homeDate ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                              Safely Home
                            </span>
                          ) : checkOutDate ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              In Transit
                            </span>
                          ) : checkInDate ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              At Workplace
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                              Absent
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* TAB 3: Location Trail */}
        {activeTab === "locations" && (
          <Card className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Location Tracking History (5-Minute Interval)
                </h3>
                <p className="text-xs text-slate-500">
                  Logs recorded during active app usage (retained automatically for 30 days)
                </p>
              </div>
              {locationLogs.length > 0 && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${locationLogs[0].latitude},${locationLogs[0].longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  View Latest Position in Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    PING TIMESTAMP
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    COORDINATES (LAT, LNG)
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-xs">
                    ACCURACY
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-xs text-right">
                    MAP
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locationLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                      No location pings recorded for this trainee in the last 30 days.
                    </TableCell>
                  </TableRow>
                ) : (
                  locationLogs.slice(0, 30).map((loc) => (
                    <TableRow key={loc.id} className="hover:bg-slate-50/60">
                      <TableCell className="text-xs text-slate-700 font-medium">
                        {new Date(loc.recorded_at).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "medium",
                        })}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-slate-600">
                        {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                          {loc.accuracy ? `±${Math.round(loc.accuracy)}m` : "Standard"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Google Maps
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
