import { Check } from "lucide-react";

const STEPS = [
  { label: "Create Profile" },
  { label: "Upload UPI" },
  { label: "Get Score" },
  { label: "Get Document" },
];

export default function ProgressSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isFuture = stepNum > currentStep;

        return (
          <div key={step.label} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${isDone  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" : ""}
                  ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-110" : ""}
                  ${isFuture ? "bg-slate-100 text-slate-400 border-2 border-slate-200" : ""}
                `}
              >
                {isDone ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap
                  ${isActive ? "text-blue-600" : isDone ? "text-emerald-600" : "text-slate-400"}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={`
                  h-0.5 w-16 sm:w-24 mx-1 mb-5 rounded-full transition-all
                  ${stepNum < currentStep ? "bg-emerald-400" : "bg-slate-200"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
