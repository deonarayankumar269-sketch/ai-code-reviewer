export default function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </div>
  );
}