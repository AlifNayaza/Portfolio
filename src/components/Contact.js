import React from 'react';
import { Container, Typography, Box, Grid, IconButton, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub'; // Example new contact channel
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const MotionPaper = motion(Paper);
const MotionIconButton = motion(IconButton);

const Contact = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        minHeight: '100vh',
        pt: 4,
        pb: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Interactive background shapes */}
      <Box
        component={motion.div}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        {[...Array(30)].map((_, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`,
              borderRadius: '50%',
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </Box>

      {/* Decorative overlays */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          zIndex: 0,
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
            borderRadius: '50%',
            width: '150px',
            height: '150px',
            top: 0,
            left: 0,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.5, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </Box>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Get in Touch
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <MotionPaper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            >
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contact Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="body1">
                    West Kalimantan, Indonesia
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 2 }} />
                  <Typography variant="body1">
                    alifnayaza2693@gmail.com
                  </Typography>
                </Box>
              </Box>
            </MotionPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <MotionPaper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                height: '100%',
              }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
            >
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Follow Me
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
                <MotionIconButton
                  component="a"
                  href="https://github.com/AlifNayaza" // Replace with your GitHub URL
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{
                    color: theme.palette.primary.main,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      color: theme.palette.secondary.main,
                    },
                  }}
                >
                  <GitHubIcon fontSize="large" />
                </MotionIconButton>
                <MotionIconButton
                  component="a"
                  href="https://www.instagram.com/alraf26_/" // Replace with your Instagram URL
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{
                    color: theme.palette.primary.main,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      color: '#E4405F', // Instagram color
                    },
                  }}
                >
                  <InstagramIcon fontSize="large" />
                </MotionIconButton>
                <MotionIconButton
                  component="a"
                  href="https://www.linkedin.com/in/alif-haikal-nayaza-a5b587241/" // Replace with your LinkedIn URL
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{
                    color: theme.palette.primary.main,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      color: '#0077B5', // LinkedIn color
                    },
                  }}
                >
                  <LinkedInIcon fontSize="large" />
                </MotionIconButton>
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
