import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Header from './pages/Header';
import HomePage from './pages/HomePage';
import AboutEducationPage from './pages/AboutEducationPage';
import ContactPage from './pages/ContactPage';
import ProjectPage from './pages/ProjectPage';
import ThemeToggle from './pages/ThemeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const audioRef = useRef(new Audio(`${process.env.PUBLIC_URL}/2_23 AM.mp3`));

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#4a90e2',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
  });

  useEffect(() => {
    const audio = audioRef.current;

    const playAudio = async () => {
      try {
        await audio.play();
        audio.loop = true;
        audio.volume = 0.5; // Set volume to 50%
      } catch (error) {
        console.log("Audio play failed:", error);
      }
    };

    // Check if autoplay is allowed
    if (audio.paused) {
      // Wait for user interaction
      const handleUserInteraction = () => {
        playAudio();
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
      };

      window.addEventListener('click', handleUserInteraction);
      window.addEventListener('keydown', handleUserInteraction);
    } else {
      playAudio();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box className="App" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, marginTop: '64px', padding: '40px 20px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<HomePage />} />
              <Route path="/about" element={<AboutEducationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/projects" element={<ProjectPage />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
            </Routes>
          </Box>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
