type StatusDotProps = {
  status: "online" | "offline" | "unknown";
  label?: string;
};

const styles = {
  online: {
    dot: "bg-green-400",
    pulse: "animate-ping bg-green-400",
    text: "text-green-400",
  },
  offline: { dot: "bg-red-400", pulse: "", text: "text-red-400" },
  unknown: { dot: "bg-slate-500", pulse: "", text: "text-slate-400" },
};

export function StatusDot({ status, label }: StatusDotProps) {
  const s = styles[status];
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {s.pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${s.pulse}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${s.dot}`}
        />
      </span>
      {label && <span className={`text-sm ${s.text}`}>{label}</span>}
    </span>
  );
}
