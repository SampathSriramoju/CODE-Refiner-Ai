import React from "react";

export default function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      {label && (
        <div className="mb-1.5 text-xs font-medium text-zinc-400">{label}</div>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5",
            "text-sm text-zinc-200 outline-none transition-all duration-200",
            "focus:border-[rgba(var(--primary),0.5)] focus:ring-2 focus:ring-[rgba(var(--primary),0.15)]",
            "hover:border-white/[0.12]",
          ].join(" ")}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-zinc-950 text-zinc-200"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </label>
  );
}
