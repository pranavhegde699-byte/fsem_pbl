import { motion } from "framer-motion";

export default function SubScoreBar({ label, value, color = "#3B82F6", delay = 0, compact = false }) {
  const pct = Math.min((value / 170) * 100, 100);

  return (
    <div className={`flex items-center gap-3 ${compact ? "gap-2" : ""}`}>
      <span className={`text-slate-600 font-medium shrink-0 ${compact ? "text-xs w-28" : "text-sm w-36"}`}>
        {label}
      </span>
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${compact ? "h-1.5" : "h-2.5"}`}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 0.9, ease: [0.34, 1.1, 0.64, 1] }}
        />
      </div>
      <span className={`font-bold text-slate-800 shrink-0 ${compact ? "text-xs w-8 text-right" : "text-sm w-10 text-right"}`}>
        {value}
      </span>
    </div>
  );
}
