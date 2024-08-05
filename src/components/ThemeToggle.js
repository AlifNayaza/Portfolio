import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { motion } from 'framer-motion';

const MotionIconButton = motion(IconButton);

const ThemeToggle = ({ toggleTheme }) => {
  const theme = useTheme();
  return (
    <MotionIconButton
      sx={{ ml: 1 }}
      onClick={toggleTheme}
      color="inherit"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </MotionIconButton>
  );
};

export default ThemeToggle;
