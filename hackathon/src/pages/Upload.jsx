import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  UploadCloud, FileText, CheckCircle2, Loader2,
  ShieldCheck, AlertCircle, TrendingUp, ArrowLeft
} from "lucide-react";
import ProgressSteps from "../components/ProgressSteps";
import { uploadUpiPdf } from "../api/uploads";
import { calculateScore } from "../api/scores";
import { useAuth } from "../context/AuthContext";

export default function Upload() {
  const navigate = useNavigate();
  const { workerId } = useAuth();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select File, 2: Uploading/Parsing, 3: Calculating Score, 4: Success

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.type === "application/pdf" || selected.name.toLowerCase().endsWith('.pdf'))) {
      setFile(selected);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type === "application/pdf" || dropped.name.toLowerCase().endsWith('.pdf'))) {
      setFile(dropped);
    } else {
      toast.error("Please drop a valid PDF file");
    }
  };

  const handleUploadAndCalculate = async () => {
    if (!file) return;
    
    setLoading(true);
    setStep(2); // Uploading & Parsing

    try {
      const wId = workerId || localStorage.getItem("workproof_worker_id");
      
      // Step 2: Upload
      await uploadUpiPdf(file);
      
      setStep(3); // Calculating Score

      // Step 3: Calculate score from DB records
      const scoreRes = await calculateScore(wId);
      const newScore = scoreRes.data.total_score || scoreRes.data.score;
      if (newScore) {
        localStorage.setItem("workproof_score", newScore);
        if (scoreRes.data.id) localStorage.setItem("workproof_score_id", scoreRes.data.id);
      }

      setStep(4); // Success
      toast.success("Score calculated successfully!");

      // Wait a moment so user sees success state, then redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      console.error(err);
      localStorage.removeItem("workproof_score");
      localStorage.removeItem("workproof_score_id");
      toast.error(err?.message || "Failed to process your statement");
      setStep(1); // Reset
      setFile(null);
    } finally {
      setLoading(false);
    }
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

      <div className="max-w-3xl mx-auto">
        <ProgressSteps currentStep={2} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-white rounded-3xl shadow-md border border-slate-100 p-8 md:p-12 relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              Upload Your UPI Statement
            </h1>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              We need a minimum of 3 months of UPI history (PhonePe, GPay, Paytm) to calculate a trustworthy alternate credit score.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!loading && step === 1 && (
              <motion.div
                key="step-select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {!file ? (
                  /* Drop zone */
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-3xl p-10 cursor-pointer transition-colors flex flex-col items-center justify-center text-center group"
                  >
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="font-bold text-slate-700 text-lg mb-1">Click or drag PDF here</p>
                    <p className="text-slate-500 text-sm mb-4">Max file size: 10MB</p>
                    <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-200">
                      Select Statement
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="application/pdf"
                      className="hidden"
                    />
                  </div>
                ) : (
                  /* File selected state */
                  <div className="border-2 border-emerald-200 bg-emerald-50 rounded-3xl p-8 flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                      <FileText className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-bold text-slate-800 text-base truncate mb-0.5">{file.name}</p>
                      <p className="text-sm text-emerald-700 font-medium">Ready to process · {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="px-3 py-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-lg text-xs font-semibold transition-colors shrink-0"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Secure / Guidelines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Aadhaar Secured</p>
                      <p className="text-xs text-slate-500 mt-1">Your data is matched strictly with your Aadhaar identity. No third-party sharing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 text-sm">Need Help?</p>
                      <p className="text-xs text-amber-700 mt-1">Make sure there is no password protection on the PDF.</p>
                    </div>
                  </div>
                </div>

                {/* Proceed button */}
                <button
                  onClick={handleUploadAndCalculate}
                  disabled={!file}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base flex justify-center items-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Analyze & Generate Score
                </button>
              </motion.div>
            )}

            {loading && step > 1 && step < 4 && (
              <motion.div
                key="step-loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50 m-2 rounded-full">
                    {step === 2 ? (
                      <UploadCloud className="w-8 h-8 text-blue-600" />
                    ) : (
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {step === 2 ? "Reading Statement..." : "Calculating Score..."}
                </h3>
                <p className="text-slate-500 text-sm animate-pulse">
                  {step === 2 
                    ? "Our AI is securely analyzing your UPI transaction history. This takes a few seconds."
                    : "Applying 40+ dynamic parameters to generate your alternate credit footprint..."}
                </p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 relative">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </motion.div>
                  {/* Ripple effect */}
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-ping opacity-20" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-2">Success!</h3>
                <p className="text-slate-500 mb-6">Your WorkProof Score is ready. Redirecting to Dashboard...</p>
                
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
