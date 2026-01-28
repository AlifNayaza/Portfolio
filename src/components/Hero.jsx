export default function Hero({ home, profile, contact }) {
  return (
    <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 pt-20">
      {/* Text Side */}
      <div className="flex-1 space-y-6 animate-in slide-in-from-left duration-700">
        <div 
          className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase"
          style={{
            border: '1px solid rgba(159, 18, 57, 0.3)',
            backgroundColor: 'rgba(159, 18, 57, 0.1)',
            color: 'var(--color-crimson)'
          }}
        >
          Available for projects
        </div>
        
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
          style={{ color: 'var(--color-paper)' }}
        >
          Hello, I'm <br />
          <span 
            className="glow-text"
            style={{
              background: 'linear-gradient(to right, var(--color-crimson), var(--color-gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {home?.title}
          </span>
        </h1>
        
        <p 
          className="text-xl max-w-lg leading-relaxed pl-6"
          style={{ 
            color: 'var(--color-muted)',
            borderLeft: '2px solid var(--color-crimson)'
          }}
        >
          {home?.subtitle}
        </p>

        <div className="flex gap-4 pt-4">
          <a 
            href="#projects" 
            className="px-8 py-3 font-bold rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--color-paper)',
              color: 'var(--color-bg)'
            }}
          >
            View Work
          </a>
          {contact?.github && (
            <a 
              href={contact.github} 
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 rounded-lg transition-colors"
              style={{
                border: '1px solid var(--color-line)',
                color: 'var(--color-muted)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-crimson)';
                e.currentTarget.style.color = 'var(--color-crimson)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-line)';
                e.currentTarget.style.color = 'var(--color-muted)';
              }}
            >
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Image Side (Creative Shapes) */}
      <div className="relative group w-full max-w-md aspect-square">
        {/* Abstract Background Shapes */}
        <div 
          className="absolute inset-0 rounded-full blur-[100px] opacity-20 animate-pulse"
          style={{
            background: 'linear-gradient(to top right, var(--color-crimson), var(--color-gold))'
          }}
        ></div>
        <div 
          className="absolute top-4 right-4 w-full h-full rounded-2xl z-0 transition-transform group-hover:translate-x-4 group-hover:-translate-y-4"
          style={{
            border: '2px solid var(--color-crimson)'
          }}
        ></div>
        <div 
          className="absolute bottom-4 left-4 w-full h-full rounded-2xl z-0"
          style={{
            backgroundColor: 'var(--color-line)'
          }}
        ></div>
        
        {/* Main Image */}
        <div 
          className="relative z-10 w-full h-full overflow-hidden rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
            {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-line)',
                    color: 'var(--color-muted)'
                  }}
                >
                  No Image
                </div>
            )}
        </div>
      </div>
    </section>
  );
}