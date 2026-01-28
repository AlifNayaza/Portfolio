export default function Footer({ home, contact }) {
  return (
    <footer 
      id="contact" 
      className="py-20 mt-20"
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 
          className="text-4xl md:text-6xl font-bold mb-8"
          style={{ color: 'var(--color-paper)' }}
        >
          Let's create something{' '}
          <span 
            style={{
              background: 'linear-gradient(to right, var(--color-crimson), var(--color-gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Unique
          </span>
        </h2>
        
        <div className="flex justify-center gap-6 mb-12">
           {contact?.email && (
             <a 
               href={`mailto:${contact.email}`} 
               className="text-xl font-medium transition-colors"
               style={{ color: 'var(--color-paper)' }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.color = 'var(--color-crimson)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.color = 'var(--color-paper)';
               }}
             >
               {contact.email}
             </a>
           )}
        </div>

        <div 
          className="flex justify-center gap-8"
          style={{ color: 'var(--color-muted)' }}
        >
            {contact?.linkedin && (
              <a 
                href={contact.linkedin} 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-paper)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-muted)';
                }}
              >
                LinkedIn
              </a>
            )}
            {contact?.instagram && (
              <a 
                href={contact.instagram} 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-paper)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-muted)';
                }}
              >
                Instagram
              </a>
            )}
            {contact?.twitter && (
              <a 
                href={contact.twitter} 
                className="transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-paper)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-muted)';
                }}
              >
                Twitter
              </a>
            )}
        </div>
        
        <p 
          className="mt-12 text-sm"
          style={{ color: 'var(--color-line)' }}
        >
          &copy; {new Date().getFullYear()} {home?.title}. Powered by React & Tailwind.
        </p>
      </div>
    </footer>
  );
}