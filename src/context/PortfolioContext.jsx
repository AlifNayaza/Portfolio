/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem("portfolio_data_cache");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => !data);

  const fetchData = async (silent = false) => {
    if (!silent && !data) setLoading(true);
    try {
      // Plain fetch keeps axios out of the public bundle and can reuse the <link rel="preload"> in index.html
      const res = await fetch("/.netlify/functions/portfolio", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`Portfolio API responded ${res.status}`);
      const json = await res.json();
      setData(json);
      try {
        localStorage.setItem("portfolio_data_cache", JSON.stringify(json));
      } catch (e) {
        console.warn("Failed to cache portfolio data", e);
      }
    } catch (error) {
      console.error(error);
      if (!data) {
        toast.error("Couldn't load the latest portfolio content. Please refresh.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(!!data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, loading, refreshData: () => fetchData(true) }}>
      {children}
    </PortfolioContext.Provider>
  );
};