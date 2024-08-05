import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ThemeToggle from './components/ThemeToggle';
import MusicPlayer from './components/MusicPlayer';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#FE6B8B', // Soft pink for primary
          },
          secondary: {
            main: '#FF8E53', // Orange for secondary
          },
          background: {
            default: mode === 'light' ? '#f0f0f0' : '#000000', // Light grey or black background
            paper: mode === 'light' ? '#ffffff' : '#121212', // White or very dark grey for paper
          },
          text: {
            primary: mode === 'light' ? '#000000' : '#e0e0e0', // Black or light grey text
            secondary: mode === 'light' ? '#555555' : '#b0b0b0', // Dark grey or lighter grey for secondary text
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header>
          <ThemeToggle toggleTheme={toggleTheme} />
        </Header>
        <AnimatedRoutes />
        <MusicPlayer /> {/* Add MusicPlayer here */}
      </Router>
    </ThemeProvider>
  );
}

export default App;
