export default function Skills({ skills }) {
  return (
    <section className="py-10 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-accent mb-8 font-mono text-sm uppercase tracking-[0.2em]">
          Technology Stack
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {skills?.map((skill, idx) => (
            <span 
              key={idx} 
              className="px-6 py-3 rounded-xl bg-surface border border-white/5 hover:border-primary/50 text-zinc-300 hover:text-white transition-all hover:-translate-y-1 cursor-default font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}