import { cn } from "../../lib/utils";

export default function Input({ label, className, textarea, ...props }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>}
      <Comp
        className={cn(
          "w-full bg-zinc-50/5 border border-white/10 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-zinc-600",
          className
        )}
        {...props}
      />
    </div>
  );
}