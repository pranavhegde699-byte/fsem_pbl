import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ExternalLink, FileText, TrendingUp, Building2, CheckCircle2,
  Percent, MapPin, ChevronRight, Frown, ArrowLeft
} from "lucide-react";
import ProgressSteps from "../components/ProgressSteps";
import { getMatchedSchemes } from "../api/schemes";
import { useAuth } from "../context/AuthContext";

const gradeFromScore = (score) => {
  if (score >= 750) return { grade: "A+", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (score >= 650) return { grade: "A",  color: "bg-blue-100 text-blue-700 border-blue-200" };
  if (score >= 550) return { grade: "B+", color: "bg-purple-100 text-purple-700 border-purple-200" };
  if (score >= 450) return { grade: "B",  color: "bg-amber-100 text-amber-700 border-amber-200" };
  if (score >= 350) return { grade: "C",  color: "bg-orange-100 text-orange-700 border-orange-200" };
  return                    { grade: "D",  color: "bg-red-100 text-red-700 border-red-200" };
};

const schemeAccents = [
  { from: "from-blue-500", to: "to-indigo-600", light: "bg-blue-50", border: "border-blue-200", icon: "🏛️" },
  { from: "from-emerald-500", to: "to-teal-600", light: "bg-emerald-50", border: "border-emerald-200", icon: "🏦" },
  { from: "from-purple-500", to: "to-violet-600", light: "bg-purple-50", border: "border-purple-200", icon: "🌾" },
  { from: "from-orange-500", to: "to-amber-600", light: "bg-orange-50", border: "border-orange-200", icon: "💼" },
];

function SchemeCard({ scheme, index }) {
  const accent = schemeAccents[index % schemeAccents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Gradient top bar */}
      <div className={`h-1.5 bg-gradient-to-r ${accent.from} ${accent.to}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-2xl ${accent.light} ${accent.border} border flex items-center justify-center text-xl shrink-0`}>
              {accent.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">{scheme.scheme_name || scheme.name}</h3>
              {scheme.translated_name && (
                <p className="text-xs text-slate-500 mt-0.5">{scheme.translated_name}</p>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl border border-emerald-200 whitespace-nowrap">
              {scheme.loan_amount || 'Amount varies'}
            </span>
          </div>
        </div>

        {/* Chips row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {scheme.interest_rate && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
              <Percent className="w-3 h-3" />
              {scheme.interest_rate}% interest
            </span>
          )}
          {scheme.nearest_bank && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
              <MapPin className="w-3 h-3" />
              {scheme.nearest_bank}
            </span>
          )}
          {scheme.type && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
              <Building2 className="w-3 h-3" />
              {scheme.type}
            </span>
          )}
        </div>

        {/* How to Apply */}
        {scheme.how_to_apply && (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-800 font-medium">{scheme.how_to_apply}</p>
          </div>
        )}

        {/* Description */}
        {scheme.description && (
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">{scheme.description}</p>
        )}

        {/* Apply button */}
        <a
          href={scheme.apply_link || `https://www.myscheme.gov.in/search?q=${encodeURIComponent(scheme.scheme_name || scheme.name || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-5 py-2.5 border-2 border-blue-200 text-blue-700 font-semibold
            text-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group-hover:translate-x-0.5`}
        >
          How to Apply
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

export default function Schemes() {
  const navigate = useNavigate();
  const { workerId } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const score = parseInt(localStorage.getItem("workproof_score") || "0");
  const { grade, color } = gradeFromScore(score);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const wId = workerId || localStorage.getItem("workproof_worker_id");
        const res = await getMatchedSchemes(wId);
        setSchemes(res.data.matched_schemes || res.data || []);
      } catch (err) {
        if (!err.message.includes("No score found")) {
          toast.error(err.message || "Failed to load schemes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-16 px-4">
      {/* ─── Premium Header ─── */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            WP
          </div>
          <span className="font-bold text-slate-800 text-base">WorkProof</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all border border-slate-200/60 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-5xl mx-auto">
        <ProgressSteps currentStep={4} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
                <TrendingUp className="w-3 h-3" /> Personalised Matches
              </span>
              <h1 className="text-3xl font-bold text-slate-900">Schemes You Qualify For</h1>
              <p className="text-slate-500 text-sm mt-1">Based on your WorkProof Score and occupation profile</p>
            </div>
            {score > 0 && (
              <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${color} shrink-0`}>
                <span className="text-2xl font-black">{score}</span>
                <div>
                  <p className="text-xs font-bold">Grade {grade}</p>
                  <p className="text-xs opacity-70">WorkProof Score</p>
                </div>
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 animate-pulse">
                  <div className="h-1.5 bg-slate-100 rounded-full mb-4" />
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-slate-100 rounded" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                  </div>
                  <div className="h-9 bg-slate-100 rounded-xl w-32" />
                </div>
              ))}
            </div>
          ) : schemes.length > 0 ? (
            <>
              {/* Schemes count badge */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm text-slate-500">
                  <strong className="text-slate-800">{schemes.length} scheme{schemes.length > 1 ? "s" : ""}</strong> matched to your profile
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {schemes.map((scheme, i) => (
                  <SchemeCard key={scheme.id || i} scheme={scheme} index={i} />
                ))}
              </div>
            </>
          ) : (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
                <Frown className="w-9 h-9 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Keep Building Your Score!</h3>
              <p className="text-slate-500 max-w-sm mb-6 text-sm">
                No schemes matched right now. Try again after 3 months of consistent UPI activity to boost your score.
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all text-sm"
              >
                Re-upload Statement
              </button>
            </motion.div>
          )}

          {/* Footer CTA */}
          {schemes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <button
                onClick={() => navigate("/document")}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl
                  shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              >
                <FileText className="w-5 h-5" />
                Generate My Financial Passport
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                A shareable 1-page document you can show to any bank or MFI
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
