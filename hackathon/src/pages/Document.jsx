import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FileText, Download, Link2, CheckCircle2, Loader2,
  BadgeCheck, TrendingUp, LayoutList, ShieldCheck, Globe, Sparkles, ArrowLeft
} from "lucide-react";
import ProgressSteps from "../components/ProgressSteps";
import { generateDocument } from "../api/documents";
import { useAuth } from "../context/AuthContext";

const LANGUAGES = [
  { code: "en", label: "English",  script: "English" },
  { code: "hi", label: "हिंदी",    script: "Hindi" },
  { code: "ta", label: "தமிழ்",    script: "Tamil" },
  { code: "te", label: "తెలుగు",   script: "Telugu" },
  { code: "kn", label: "ಕನ್ನಡ",    script: "Kannada" },
];

const CHECKLIST = [
  { icon: <BadgeCheck className="w-4 h-4 text-emerald-600" />, text: "Your WorkProof Score (0–850)" },
  { icon: <TrendingUp className="w-4 h-4 text-blue-600" />,    text: "Income summary from UPI history" },
  { icon: <LayoutList className="w-4 h-4 text-purple-600" />,  text: "5 sub-score breakdown" },
  { icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />, text: "Matched scheme eligibility" },
  { icon: <Globe className="w-4 h-4 text-rose-500" />,         text: "AI-written explanation in your language" },
];

export default function Document() {
  const navigate = useNavigate();
  const { workerId } = useAuth();
  const preferredLang = localStorage.getItem("workproof_language") || "en";
  const [selectedLang, setSelectedLang] = useState(preferredLang);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const scoreId = localStorage.getItem("workproof_score_id");
  const genDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const wId = workerId || localStorage.getItem("workproof_worker_id");
      const res = await generateDocument(wId, selectedLang, scoreId);
      setPdfUrl(res.data.file_url);
      toast.success("Your document is ready!");
    } catch (err) {
      toast.error(err.message || "Failed to generate document");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pdfUrl);
    toast.success("Link copied to clipboard!");
  };

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

      <div className="max-w-4xl mx-auto">
        <ProgressSteps currentStep={4} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <AnimatePresence mode="wait">
            {!pdfUrl ? (
              /* ─── STATE A: GENERATE ─── */
              <motion.div
                key="generate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-100">
                    <FileText className="w-3 h-3" /> Financial Passport
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Generate Your Financial Passport</h1>
                  <p className="text-slate-500 max-w-xl mx-auto text-sm">
                    A 1-page document you can show to any bank, MFI, or NBFC. Works like a salary slip — built for your kind of work.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* LEFT: Info */}
                  <div className="flex flex-col gap-5">
                    {/* What's inside */}
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
                      <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        What's Inside
                      </h2>
                      <ul className="space-y-3">
                        {CHECKLIST.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                              {item.icon}
                            </div>
                            <span className="text-sm text-slate-700">{item.text}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Language selector */}
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
                      <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        Generate in Language:
                      </h2>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {LANGUAGES.slice(0, 3).map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setSelectedLang(lang.code)}
                            className={`py-2.5 px-3 rounded-xl text-center transition-all border text-sm font-semibold
                              ${selectedLang === lang.code
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {LANGUAGES.slice(3).map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setSelectedLang(lang.code)}
                            className={`py-2.5 px-3 rounded-xl text-center transition-all border text-sm font-semibold
                              ${selectedLang === lang.code
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate button */}
                    <motion.button
                      onClick={handleGenerate}
                      disabled={loading}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:opacity-60
                        text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating in {LANGUAGES.find(l => l.code === selectedLang)?.script}...
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          Generate My Document
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* RIGHT: Document preview mockup */}
                  <div className="flex flex-col">
                    <div className="relative flex-1 bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden min-h-[400px]">
                      {/* Mockup content */}
                      <div className="p-6 h-full flex flex-col">
                        {/* Header bar */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
                          <div className="h-5 w-16 bg-blue-100 rounded-full animate-pulse" />
                        </div>
                        {/* Score area */}
                        <div className="flex items-center gap-4 mb-5 p-3 bg-slate-50 rounded-xl">
                          <div className="w-14 h-14 bg-slate-200 rounded-full animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
                            <div className="h-3 bg-slate-100 rounded w-28 animate-pulse" />
                          </div>
                        </div>
                        {/* Bars */}
                        <div className="space-y-2.5 mb-4">
                          {[80, 65, 72, 55, 88].map((w, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-200 rounded-full" style={{ width: `${w}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Text lines */}
                        <div className="space-y-1.5 flex-1">
                          {[100, 90, 85, 75, 60].map((w, i) => (
                            <div key={i} className="h-2.5 bg-slate-100 rounded animate-pulse" style={{ width: `${w}%` }} />
                          ))}
                        </div>
                        {/* Footer */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                        </div>
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-slate-600 font-semibold text-sm text-center px-6">
                          Generate to unlock your document
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ─── STATE B: DOWNLOAD ─── */
              <motion.div
                key="download"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Success animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-slate-900 mb-2"
                >
                  Your Document is Ready! 🎉
                </motion.h1>
                <p className="text-slate-500 mb-8 text-sm">
                  Your Financial Passport has been generated in{" "}
                  <strong>{LANGUAGES.find(l => l.code === selectedLang)?.label}</strong>
                </p>

                {/* PDF Preview */}
                <div className="w-full mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                  <iframe
                    src={pdfUrl}
                    className="w-full"
                    style={{ height: 600 }}
                    title="Financial Passport"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <a
                    href={pdfUrl}
                    download={`WorkProof_Passport_${selectedLang.toUpperCase()}.pdf`}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl
                      transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-3.5 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50
                      text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Link2 className="w-4 h-4" />
                    Copy Share Link
                  </button>
                </div>

                {/* Note */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-md w-full text-center">
                  <p className="text-sm text-amber-800 font-medium mb-1">
                    Show this at any MFI, NBFC, or bank branch near you.
                  </p>
                  <p className="text-xs text-amber-600">
                    Generated: {genDate} · Valid for 90 days
                  </p>
                </div>

                {/* Regenerate */}
                <button
                  onClick={() => setPdfUrl(null)}
                  className="mt-4 text-xs text-slate-400 hover:text-blue-600 underline transition-colors"
                >
                  Regenerate in a different language
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
