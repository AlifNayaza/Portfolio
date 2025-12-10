import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PortfolioContext = createContext();

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get("/.netlify/functions/portfolio");
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data portofolio.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, loading, refreshData: () => fetchData(true) }}>
      {children}
    </PortfolioContext.Provider>
  );
};