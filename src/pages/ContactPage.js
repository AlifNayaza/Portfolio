import React from 'react';
import { Typography, Container, Box, Link, Grid, useTheme } from '@mui/material';
import { GitHub, Instagram, LinkedIn, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import TypingEffect from 'react-typing-effect';

function ContactPage() {
  const theme = useTheme(); // Access the current theme

  const contactItems = [
    { icon: GitHub, text: 'GitHub', link: 'https://github.com/AlifNayaza' },
    { icon: Instagram, text: 'Instagram', link: 'https://www.instagram.com/alraf26_/' },
    { icon: LinkedIn, text: 'LinkedIn', link: 'https://www.linkedin.com/in/alif-haikal-nayaza-a5b587241/' },
    { icon: Email, text: 'Email', link: 'mailto:alifnayaza2693@gmail.com' },
  ];

  return (
    <Container maxWidth="lg">
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ textAlign: 'center', mb: 4 }}
      >
        <Typography variant="h2" gutterBottom>
          <TypingEffect 
            text={['Contact Me', 'Get in Touch', 'Reach Out']}
            speed={50}
            eraseSpeed={30}
            typingDelay={100}
            eraseDelay={1000}
            cursorRenderer={cursor => <span>{cursor}</span>}
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
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                  color: theme.palette.common.white,
                  transition: 'all 0.3s',
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 8,
                  borderRadius: 8,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  border: theme.palette.mode === 'dark' ? `2px solid ${theme.palette.primary.main}` : 'none',
                  backgroundColor: theme.palette.background.paper, // Initial background color
                  color: theme.palette.text.primary, // Initial text color
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
                  }}
                >
                  <item.icon sx={{ mr: 1 }} /> {item.text}
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default ContactPage;
