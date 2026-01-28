export default function Skills({ skills }) {
  return (
    <section 
      className="py-10"
      style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <p 
          className="text-center mb-8 font-mono text-sm uppercase tracking-[0.2em]"
          style={{ color: 'var(--color-crimson)' }}
        >
          Technology Stack
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {skills?.map((skill, idx) => (
            <span 
              key={idx} 
              className="px-6 py-3 rounded-xl border transition-all hover:-translate-y-1 cursor-default font-medium"
              style={{
                backgroundColor: 'var(--color-line)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-crimson)';
                e.currentTarget.style.color = 'var(--color-paper)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-muted)';
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}