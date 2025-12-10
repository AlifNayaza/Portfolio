import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";

export default function Projects() {
  const { data } = usePortfolio();
  
  return (
    <PageTransition>
      <section className="py-20 pl-4 md:pl-16 relative">
         <div className="absolute top-20 -left-6 md:-left-12 font-mono text-xs text-[#333] rotate-180" style={{ writingMode: 'vertical-rl' }}>
            CHAPTER II /// THE ARCHIVE
        </div>

        <div className="mb-16 border-b border-[#333] pb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h1 className="text-4xl md:text-6xl font-display mb-2">Battle Records<span className="text-[#9f1239]">.</span></h1>
                <p className="font-serif italic text-zinc-500">A collection of completed projects.</p>
            </div>
            <div className="font-mono text-xs text-zinc-600">
                TOTAL ENTRIES: {data.projects?.length || 0}
            </div>
        </div>

        <div className="grid grid-cols-1 gap-0">
            {data.projects?.map((proj, idx) => (
                <Link to={`/project/${idx}`} key={idx} className="group block border-b border-[#333] hover:bg-[#111] transition-colors py-8">
                    <div className="grid md:grid-cols-12 gap-8 items-center">
                        
                        {/* Index Number */}
                        <div className="md:col-span-1 font-mono text-xs text-zinc-600 group-hover:text-[#9f1239]">
                            {String(idx + 1).padStart(2, '0')}
                        </div>

                        {/* Title & Desc */}
                        <div className="md:col-span-6">
                            <h3 className="text-2xl font-display text-white mb-2 group-hover:translate-x-2 transition-transform duration-500">
                                {proj.name}
                            </h3>
                            <p className="text-zinc-500 font-serif text-sm line-clamp-1 italic max-w-md">
                                {proj.description}
                            </p>
                        </div>

                        {/* Tech/Category (Placeholder jika tidak ada data kategori, kita pakai 'Classified') */}
                        <div className="md:col-span-3 font-mono text-xs text-zinc-600 uppercase tracking-wider text-right md:text-left">
                            [ CLASSIFIED DATA ]
                        </div>

                        {/* Arrow */}
                        <div className="md:col-span-2 text-right">
                             <span className="font-mono text-xs group-hover:text-white text-zinc-600 transition-colors">
                                 OPEN FILE &rarr;
                             </span>
                        </div>

                    </div>
                </Link>
            ))}
        </div>
      </section>
    </PageTransition>
  );
}