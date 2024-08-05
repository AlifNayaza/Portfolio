import React, { useState, useRef } from 'react';
import { IconButton, Slider, Tooltip, Box, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);
  const theme = useTheme(); // Use theme to adjust styles

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue / 100;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Toggle Button */}
      <Tooltip title="Music Player">
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          color="inherit"
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            p: 1,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
            transition: 'background-color 0.3s ease',
          }}
        >
          <MusicNoteIcon
            fontSize="large"
            sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black' }}
          />
        </IconButton>
      </Tooltip>

      {/* Music Player Controls */}
      {isOpen && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: theme.palette.background.paper,
            borderRadius: '12px',
            boxShadow: `0 4px 8px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 200,
            maxWidth: '80vw',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isOpen ? 1 : 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Tooltip title={isPlaying ? "Pause" : "Play"}>
              <IconButton onClick={togglePlay} color="inherit">
                {isPlaying ? <PauseIcon fontSize="medium" /> : <PlayArrowIcon fontSize="medium" />}
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Tooltip title="Volume">
              <IconButton color="inherit">
                {volume > 0 ? <VolumeUpIcon /> : <VolumeMuteIcon />}
              </IconButton>
            </Tooltip>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              aria-labelledby="volume-slider"
              min={0}
              max={100}
              sx={{
                width: 120,
                height: 4,
                '& .MuiSlider-thumb': {
                  backgroundColor: theme.palette.primary.main,
                },
                '& .MuiSlider-track': {
                  backgroundColor: theme.palette.secondary.main,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#e0e0e0',
                },
              }}
            />
          </Box>
          <audio ref={audioRef} src="/music/2_23 AM.mp3" loop />
        </Box>
      )}
    </Box>
  );
};

export default MusicPlayer;
