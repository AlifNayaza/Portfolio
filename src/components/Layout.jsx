import { Outlet } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Footer from "./Footer";
import { usePortfolio } from "../context/PortfolioContext";

export default function Layout() {
  const { data, loading } = usePortfolio();

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-dark text-zinc-200 min-h-screen font-sans selection:bg-primary selection:text-white flex flex-col">
      <Navbar home={data.home} contact={data.contact} />
      
      {/* Outlet adalah tempat halaman (Home, About, dll) akan dirender */}
      <main className="flex-grow pt-20"> 
        <Outlet />
      </main>

      <Footer home={data.home} contact={data.contact} />
    </div>
  );
}