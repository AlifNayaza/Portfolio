export default function Hero({ home, profile, contact }) {
  return (
    <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 pt-20">
      {/* Text Side */}
      <div className="flex-1 space-y-6 animate-in slide-in-from-left duration-700">
        <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs text-accent font-mono tracking-widest uppercase">
          Available for projects
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
          Hello, I'm <br />
          <span className="text-gradient">{home?.title}</span>
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-lg leading-relaxed border-l-2 border-accent pl-6">
          {home?.subtitle}
        </p>

        <div className="flex gap-4 pt-4">
          <a href="#projects" className="px-8 py-3 bg-white text-dark font-bold rounded-lg hover:bg-zinc-200 transition-colors">
            View Work
          </a>
          {contact?.github && (
            <a href={contact.github} target="_blank" className="px-8 py-3 border border-zinc-700 rounded-lg hover:border-primary hover:text-primary transition-colors">
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Image Side (Creative Shapes) */}
      <div className="relative group w-full max-w-md aspect-square">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute top-4 right-4 w-full h-full border-2 border-accent rounded-2xl z-0 transition-transform group-hover:translate-x-4 group-hover:-translate-y-4"></div>
        <div className="absolute bottom-4 left-4 w-full h-full bg-surface rounded-2xl z-0"></div>
        
        {/* Main Image */}
        <div className="relative z-10 w-full h-full overflow-hidden rounded-2xl border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
            {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">No Image</div>
            )}
        </div>
      </div>
    </section>
  );
}