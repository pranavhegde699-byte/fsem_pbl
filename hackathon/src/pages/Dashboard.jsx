import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  LayoutDashboard, TrendingUp, Building2, FileText,
  LogOut, RefreshCw, ChevronRight, Download,
  MapPin, Briefcase, ExternalLink, AlertCircle, UserCircle2
} from "lucide-react";
import SubScoreBar from "../components/SubScoreBar";
import { getWorker } from "../api/workers";
import { getLatestScore } from "../api/scores";
import { getMatchedSchemes } from "../api/schemes";
import { getLatestDocument } from "../api/documents";
import { useAuth } from "../context/AuthContext";

const gradeFromScore = (score) => {
  if (score >= 750) return { grade: "A+", color: "#10B981", ringClass: "text-emerald-600", bgClass: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  if (score >= 650) return { grade: "A",  color: "#3B82F6", ringClass: "text-blue-600",    bgClass: "bg-blue-50 border-blue-200 text-blue-700" };
  if (score >= 550) return { grade: "B+", color: "#8B5CF6", ringClass: "text-purple-600",  bgClass: "bg-purple-50 border-purple-200 text-purple-700" };
  if (score >= 450) return { grade: "B",  color: "#F59E0B", ringClass: "text-amber-600",   bgClass: "bg-amber-50 border-amber-200 text-amber-700" };
  if (score >= 350) return { grade: "C",  color: "#F97316", ringClass: "text-orange-600",  bgClass: "bg-orange-50 border-orange-200 text-orange-700" };
  return                    { grade: "D",  color: "#EF4444", ringClass: "text-red-600",     bgClass: "bg-red-50 border-red-200 text-red-700" };
};

function SmallScoreRing({ score, size = 100, color }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  useEffect(() => {
    const t = setTimeout(() => setOffset(circumference * (1 - score / 850)), 400);
    return () => clearTimeout(t);
  }, [score, circumference]);
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { path: "/score",     icon: TrendingUp,      label: "My Score" },
  { path: "/schemes",   icon: Building2,       label: "Schemes" },
  { path: "/document",  icon: FileText,        label: "My Document" },
];

function CountUp({ target, duration = 1.5 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let s = 0; const step = target / (duration * 60);
    const t = setInterval(() => {
      s += step;
      if (s >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(s));
    }, 1000/60);
    return () => clearInterval(t);
  }, [target]);
  return <>{val}</>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, workerId, workerName } = useAuth();
  const [worker, setWorker] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);

  const wId = workerId || localStorage.getItem("workproof_worker_id");

  useEffect(() => {
    if (!wId) {
      navigate('/login');
      return;
    }
    const fetchAll = async () => {
      try {
        const [wRes, sRes, schRes, dRes] = await Promise.allSettled([
          getWorker(wId),
          getLatestScore(wId),
          getMatchedSchemes(wId),
          getLatestDocument(wId),
        ]);
        if (wRes.status === "fulfilled") {
          const w = wRes.value.data;
          setWorker(w);
          if (w?.name) localStorage.setItem("workproof_worker_name", w.name);
        }
        if (sRes.status   === "fulfilled") setScoreData(sRes.value.data);
        if (schRes.status === "fulfilled") setSchemes(schRes.value.data.matched_schemes || schRes.value.data || []);
        if (dRes.status   === "fulfilled") setDocData(dRes.value.data);
      } catch (err) {
        toast.error("Failed to load some data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [wId]);

  const score = scoreData?.score?.total_score || parseInt(localStorage.getItem("workproof_score") || "0");
  const { grade, color, ringClass, bgClass } = gradeFromScore(score);

  const displayName = worker?.full_name || workerName || localStorage.getItem("workproof_worker_name") || "Worker";
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const subScores = [
    { label: "Income Regularity",  value: scoreData?.score?.income_regularity || 0 },
    { label: "Spending Discipline", value: scoreData?.score?.spending_discipline || 0 },
    { label: "Savings Strength",   value: scoreData?.score?.savings_proxy || 0 },
    { label: "Network Trust",      value: scoreData?.score?.network_trust || 0 },
    { label: "Reputation",         value: scoreData?.score?.reputation || 0 },
  ];

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex pt-16">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-16 bottom-0 z-30">
        {/* Worker info */}
        <div className="px-5 py-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-3 shadow-md shadow-blue-200">
            {initials}
          </div>
          <p className="font-bold text-slate-900 text-sm leading-tight">{displayName}</p>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            {worker?.aadhaar ? `XXXX XXXX ${worker.aadhaar.slice(-4)}` : "—"}
          </p>
          {worker?.occupation && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-medium">
              {worker.occupation.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${location.pathname === path
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 ml-60 p-8 max-w-5xl">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* ROW 1: Welcome + Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Welcome card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Good day,</p>
                    <h2 className="text-2xl font-black text-slate-900">Namaste, {displayName.split(" ")[0]}! 👋</h2>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                    <UserCircle2 className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-4">Your financial profile is active and ready to use.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {worker?.occupation && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                      <Briefcase className="w-3 h-3" />
                      {worker.occupation.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  )}
                  {worker?.state && (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                      <MapPin className="w-3 h-3" />
                      {worker.state}
                    </span>
                  )}
                </div>
                <Link
                  to="/register"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Update Profile →
                </Link>
              </div>

              {/* Score summary card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                {score > 0 ? (
                  <div className="flex items-center gap-5">
                    <div className="relative shrink-0">
                      <SmallScoreRing score={score} size={100} color={color} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900">
                          <CountUp target={score} />
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${bgClass}`}>{grade}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-1">WorkProof Score</h3>
                      <p className="text-xs text-slate-500 mb-3">
                        Last calculated: {scoreData?.score?.created_at
                          ? new Date(scoreData.score.created_at).toLocaleDateString("en-IN")
                          : "—"}
                      </p>
                      <button
                        onClick={() => navigate("/upload")}
                        className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Recalculate
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <AlertCircle className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium text-sm mb-3">No score yet</p>
                    <button
                      onClick={() => navigate("/upload")}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Calculate Now →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ROW 2: Sub-scores */}
            {score > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-slate-800">Score Breakdown</h2>
                  <Link to="/score" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                    Full Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {subScores.map((s, i) => (
                    <div key={s.label} className="flex flex-col gap-1.5">
                      <p className="text-xs text-slate-500 font-medium leading-tight">{s.label}</p>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.value / 170) * 100}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-sm font-black text-slate-800">{s.value}<span className="text-xs font-normal text-slate-400">/170</span></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROW 3: Schemes + Document */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Schemes card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800">
                    Matched Schemes{" "}
                    {schemes.length > 0 && (
                      <span className="text-sm font-bold text-blue-600">({schemes.length})</span>
                    )}
                  </h2>
                  <Link to="/schemes" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                {schemes.length > 0 ? (
                  <div className="space-y-2.5">
                    {schemes.slice(0, 3).map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{s.name}</p>
                          {s.max_amount && (
                            <p className="text-xs text-emerald-600 font-medium mt-0.5">
                              Up to ₹{Number(s.max_amount).toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                        <a
                          href={s.apply_link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                        </a>
                      </motion.div>
                    ))}
                    {schemes.length > 3 && (
                      <p className="text-xs text-slate-400 text-center pt-1">
                        +{schemes.length - 3} more schemes
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6 text-center">
                    <Building2 className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500 mb-3">No schemes matched yet</p>
                    <Link
                      to="/score"
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Improve your score to qualify →
                    </Link>
                  </div>
                )}
              </div>

              {/* Document card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Financial Passport</h2>
                {docData?.file_url ? (
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-800">Document Ready</span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        Generated: {docData.generated_at
                          ? new Date(docData.generated_at).toLocaleDateString("en-IN")
                          : "—"}
                        {docData.language && ` · In ${LANG_MAP[docData.language] || docData.language}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={docData.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </a>
                      <Link
                        to="/document"
                        className="px-4 py-2.5 border border-slate-200 hover:border-blue-300 text-slate-600 font-medium text-xs rounded-xl transition-colors"
                      >
                        Regenerate
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                      <FileText className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Not generated yet</p>
                    <p className="text-xs text-slate-400 mb-4">Create your Financial Passport to share with banks</p>
                    <Link
                      to="/document"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Generate Now →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick tip banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-lg">💡 Pro Tip</p>
                <p className="text-blue-100 text-sm mt-0.5 max-w-md">
                  Upload a new UPI statement every month to keep your score fresh and qualify for better loan amounts.
                </p>
              </div>
              <button
                onClick={() => navigate("/upload")}
                className="shrink-0 px-5 py-2.5 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
              >
                Upload New Statement
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

const LANG_MAP = { en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu", kn: "Kannada" };
