interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: "cyan" | "green" | "yellow" | "red" | "slate";
}

const colorMap = {
  cyan: "text-cyan-400",
  green: "text-green-400",
  yellow: "text-yellow-400",
  red: "text-red-400",
  slate: "text-slate-300",
};

export function StatCard({ label, value, sub, color = "slate" }: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}
