export default function Projects({ projects }) {
  return (
    <section id="projects" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ color: 'var(--color-paper)' }}
          >
            Selected <span style={{ color: 'var(--color-crimson)' }}>Works</span>
          </h2>
          <div 
            className="w-24 h-1.5 rounded-full"
            style={{
              background: 'linear-gradient(to right, var(--color-crimson), var(--color-gold))'
            }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((proj, idx) => (
            <a 
              key={idx} 
              href={proj.link} 
              target="_blank"
              rel="noreferrer"
              className="group relative block rounded-2xl overflow-hidden transition-all duration-500"
              style={{
                backgroundColor: 'var(--color-line)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(159, 18, 57, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image */}
              <div className="h-64 overflow-hidden relative">
                <div 
                  className="absolute inset-0 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(159, 18, 57, 0.2)'
                  }}
                ></div>
                {proj.image ? (
                  <img 
                    src={proj.image} 
                    alt={proj.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--color-line)',
                      color: 'var(--color-muted)'
                    }}
                  >
                    No Preview
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 
                  className="text-2xl font-bold mb-3 transition-colors"
                  style={{ color: 'var(--color-paper)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-crimson)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-paper)';
                  }}
                >
                  {proj.name}
                </h3>
                <p 
                  className="leading-relaxed mb-6 line-clamp-3"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {proj.description}
                </p>
                <div 
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                  style={{ color: 'var(--color-paper)' }}
                >
                    <span 
                      className="h-[1px] group-hover:w-12 transition-all"
                      style={{
                        width: '32px',
                        backgroundColor: 'var(--color-crimson)'
                      }}
                    ></span>
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