'use client';

interface CountButtonsProps {
  followCount: number;
  violateCount: number;
  onFollow: () => void;
  onViolate: () => void;
}

export function CountButtons({
  followCount,
  violateCount,
  onFollow,
  onViolate,
}: CountButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onFollow}
        className="flex-1 group flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 transition-all duration-200"
      >
        <span className="flex items-center gap-2 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          遵守
        </span>
        <span className="bg-white/60 px-2.5 py-0.5 rounded-full text-sm font-bold text-emerald-800 group-hover:bg-white/80 transition-colors">
          {followCount}
        </span>
      </button>

      <button
        onClick={onViolate}
        className="flex-1 group flex items-center justify-between px-4 py-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 hover:border-rose-200 transition-all duration-200"
      >
        <span className="flex items-center gap-2 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          违反
        </span>
        <span className="bg-white/60 px-2.5 py-0.5 rounded-full text-sm font-bold text-rose-800 group-hover:bg-white/80 transition-colors">
          {violateCount}
        </span>
      </button>
    </div>
  );
}
