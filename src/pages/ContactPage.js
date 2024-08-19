import React from 'react';
import { Typography, Container, Box, Link, Grid, useTheme, useMediaQuery } from '@mui/material';
import { GitHub, Instagram, LinkedIn, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import TypingEffect from 'react-typing-effect';

function ContactPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Responsive design for small screens

  const contactItems = [
    { icon: GitHub, text: 'GitHub', link: 'https://github.com/AlifNayaza' },
    { icon: Instagram, text: 'Instagram', link: 'https://www.instagram.com/alraf26_/' },
    { icon: LinkedIn, text: 'LinkedIn', link: 'https://www.linkedin.com/in/alif-haikal-nayaza-a5b587241/' },
    { icon: Email, text: 'Email', link: 'mailto:alifnayaza2693@gmail.com' },
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          backgroundColor: theme.palette.background.default, // Preserve background color
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start', // Align content to the top
          px: 2,
          py: 2, // Reduced padding to move content up
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', mb: 4 }}
        >
          <Typography variant="h2" gutterBottom sx={{ color: 'black' }}>
            <TypingEffect
              text={['Contact Me', 'Get in Touch', 'Reach Out']}
              speed={50}
              eraseSpeed={30}
              typingDelay={100}
              eraseDelay={1000}
              cursorRenderer={cursor => <span>{cursor}</span>}
              displayTextRenderer={(text, i) => (
                <Typography
                  variant="h2"
                  component="span"
                  sx={{ color: 'black', fontWeight: 'bold' }}
                >
                  {text}
                </Typography>
              )}
            />
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {contactItems.map((item, index) => (
              <Grid item key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.common.white,
                    transition: 'all 0.3s ease-in-out',
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: isSmallScreen ? 4 : 8,
                    borderRadius: 12,
                    boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                    backgroundColor: theme.palette.background.paper,
                    color: 'black', // Set text color to black
                  }}
                >
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="flex"
                    alignItems="center"
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      width: '100%',
                      fontWeight: 'bold',
                    }}
                  >
                    <item.icon sx={{ mr: 2, fontSize: 24, color: 'black' }} />
                    <Typography variant={isSmallScreen ? 'body1' : 'h6'} sx={{ color: 'black' }}>
                      {item.text}
                    </Typography>
                  </Link>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default ContactPage;
