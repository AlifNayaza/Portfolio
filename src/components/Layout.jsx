import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./Footer";
import { usePortfolio } from "../context/PortfolioContext";

export default function Layout() {
  const { data, loading } = usePortfolio();

  if (loading) return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
        <div 
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-crimson)' }}
        ></div>
    </div>
  );

  return (
    <div 
      className="min-h-screen font-sans flex flex-col"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-paper)'
      }}
    >
      {/* Selection color */}
      <style>{`
        ::selection {
          background-color: var(--color-crimson);
          color: white;
        }
      `}</style>

      <Navbar home={data.home} contact={data.contact} />
      
      {/* Outlet adalah tempat halaman (Home, About, dll) akan dirender */}
      <main className="flex-grow pt-20"> 
        <Outlet />
      </main>

      <Footer home={data.home} contact={data.contact} />
    </div>
  );
}