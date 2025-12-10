export default function Footer({ home, contact }) {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          Let's create something <span className="text-gradient">Unique</span>
        </h2>
        
        <div className="flex justify-center gap-6 mb-12">
           {contact?.email && (
             <a href={`mailto:${contact.email}`} className="text-xl font-medium hover:text-primary transition-colors">{contact.email}</a>
           )}
        </div>

        <div className="flex justify-center gap-8 text-zinc-500">
            {contact?.linkedin && <a href={contact.linkedin} className="hover:text-white transition-colors">LinkedIn</a>}
            {contact?.instagram && <a href={contact.instagram} className="hover:text-white transition-colors">Instagram</a>}
            {contact?.twitter && <a href={contact.twitter} className="hover:text-white transition-colors">Twitter</a>}
        </div>
        
        <p className="mt-12 text-zinc-700 text-sm">
          &copy; {new Date().getFullYear()} {home?.title}. Powered by React & Tailwind.
        </p>
      </div>
    </footer>
  );
}