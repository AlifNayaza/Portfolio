export default function Projects({ projects }) {
  return (
    <section id="projects" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Selected <span className="text-primary">Works</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-brand rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((proj, idx) => (
            <a 
              key={idx} 
              href={proj.link} 
              target="_blank"
              rel="noreferrer"
              className="group relative block bg-surface rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.2)] transition-all duration-500"
            >
              {/* Image */}
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {proj.image ? (
                  <img 
                    src={proj.image} 
                    alt={proj.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">No Preview</div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {proj.name}
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                  {proj.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                    <span className="w-8 h-[1px] bg-primary group-hover:w-12 transition-all"></span>
                    View Case
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}