/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
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
      const res = await axios.get("/.netlify/functions/portfolio");
      setData(res.data);
      try {
        localStorage.setItem("portfolio_data_cache", JSON.stringify(res.data));
      } catch (e) {
        console.warn("Failed to cache portfolio data", e);
      }
    } catch (error) {
      console.error(error);
      if (!data) {
        toast.error("Gagal memuat data portofolio.");
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