import React from 'react';
import { Fab } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

function ThemeToggle({ darkMode, setDarkMode }) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Fab 
        color="primary" 
        aria-label="toggle dark mode"
        onClick={() => setDarkMode(!darkMode)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: 0,
          minWidth: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: darkMode ? theme.palette.grey[900] : theme.palette.grey[100],
          '&:hover': {
            backgroundColor: darkMode ? theme.palette.grey[800] : theme.palette.grey[200],
          },
        }}
      >
        {darkMode 
          ? <Brightness7 sx={{ fontSize: 24, color: theme.palette.text.primary }} /> 
          : <Brightness4 sx={{ fontSize: 24, color: theme.palette.text.primary }} />
        }
      </Fab>
    </motion.div>
  );
}

export default ThemeToggle;
