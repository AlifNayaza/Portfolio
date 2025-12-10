import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";

export default function Contact() {
  const { data } = usePortfolio();
  const { contact } = data;

  return (
    <PageTransition>
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center relative px-6">
        
        <div className="font-mono text-xs text-[#9f1239] mb-4 tracking-[0.3em] uppercase">
            // End of Line
        </div>

        <h1 className="text-5xl md:text-7xl font-display mb-8">
            Send A Signal<span className="text-[#9f1239] animate-pulse">_</span>
        </h1>
        
        <p className="font-serif text-zinc-400 italic mb-12 max-w-xl">
            Cerita ini belum berakhir. Apakah Anda ingin menjadi bagian dari bab selanjutnya? Kirimkan transmisi untuk memulai kolaborasi.
        </p>

        {contact?.email && (
            <a 
                href={`mailto:${contact.email}`} 
                className="text-2xl md:text-4xl font-mono border-b border-[#333] pb-2 hover:border-[#9f1239] hover:text-[#9f1239] transition-all"
            >
                {contact.email}
            </a>
        )}

        <div className="mt-16 flex gap-8 font-mono text-xs tracking-widest">
            {contact?.linkedin && <a href={contact.linkedin} className="hover:text-white text-zinc-600">[ LINKEDIN ]</a>}
            {contact?.github && <a href={contact.github} className="hover:text-white text-zinc-600">[ GITHUB ]</a>}
        </div>

      </section>
    </PageTransition>
  );
}