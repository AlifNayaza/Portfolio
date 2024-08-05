// Header.js
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import MailIcon from '@mui/icons-material/Mail';
import { motion } from 'framer-motion';

const MotionIconButton = motion(IconButton);

const Header = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/', color: '#FF6B6B' },
    { text: 'About', icon: <PersonIcon />, path: '/about', color: '#4ECDC4' },
    { text: 'Projects', icon: <WorkIcon />, path: '/projects', color: '#45B7D1' },
    { text: 'Contact', icon: <MailIcon />, path: '/contact', color: '#FFA07A' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <AppBar
        position="static"
        sx={{
          background: isDarkMode 
            ? 'linear-gradient(45deg, #2C3E50 30%, #34495E 90%)'
            : 'linear-gradient(45deg, #ECE9E6 30%, #FFFFFF 90%)',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: isDarkMode ? '#fff' : '#333',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Alif Haikal Nayaza
            </motion.span>
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={handleClose}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      '&:hover': {
                        backgroundColor: item.color,
                        color: '#fff',
                        transform: 'translateX(5px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#fff' : '#333' }}>
                      {item.icon}
                      <Typography sx={{ ml: 1 }}>{item.text}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <MotionIconButton
                  key={item.text}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.8 }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isDarkMode ? '#fff' : '#333',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: item.color,
                      boxShadow: `0 0 15px ${item.color}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.icon}
                </MotionIconButton>
              ))}
            </Box>
          )}
          {children}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Header;