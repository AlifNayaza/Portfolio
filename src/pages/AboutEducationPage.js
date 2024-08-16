import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, Grid, Paper, useTheme, Avatar, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { School, Work, EmojiEvents } from '@mui/icons-material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import profileImage from '../images/profil.jpg';

function AboutEducationPage() {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const [typedTitle, setTypedTitle] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  
  const titleText = "About Me";
  const subtitleText = "My Journey";
  
  useEffect(() => {
    let index = 0;
    const typingInterval = 140;
    const titleInterval = setInterval(() => {
      setTypedTitle(titleText.slice(0, index + 1));
      index += 1;
      if (index > titleText.length) {
        clearInterval(titleInterval);
      }
    }, typingInterval);

    return () => clearInterval(titleInterval);
  }, [titleText]);

  useEffect(() => {
    let index = 0;
    const typingInterval = 140;
    const subtitleInterval = setInterval(() => {
      setTypedSubtitle(subtitleText.slice(0, index + 1));
      index += 1;
      if (index > subtitleText.length) {
        clearInterval(subtitleInterval);
      }
    }, typingInterval);

    return () => clearInterval(subtitleInterval);
  }, [subtitleText]);

  // Skills
  const skills = [
    'JavaScript', 'React', 'Node.js', 'Python', 
    'MySQL', 'Jupyter', 'MongoDB', 
    'HTML', 'CSS'
  ];

  return (
    <Container maxWidth="lg">
      <Box 
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.default,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 70%)`,
            zIndex: -1,
            opacity: 0.5,
            transition: 'opacity 0.8s ease-in-out'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 70%)`,
            zIndex: -1,
            opacity: 0.5,
            transition: 'opacity 0.8s ease-in-out'
          },
          '@keyframes blink': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0 },
            '100%': { opacity: 1 }
          }
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div 
              variants={itemVariants} 
              sx={{ position: 'relative' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Avatar 
                alt="Profile Picture"
                src={profileImage}
                sx={{ 
                  width: { xs: 120, sm: 150, md: 180 },
                  height: { xs: 120, sm: 150, md: 180 },
                  border: `8px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 8px 16px ${theme.palette.primary.dark}`,
                  position: 'relative',
                  zIndex: 1,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    width: 'calc(100% + 20px)',
                    height: 'calc(100% + 20px)',
                    borderRadius: '50%',
                    border: `4px solid ${theme.palette.primary.light}`,
                    zIndex: -1,
                    boxShadow: `0 12px 24px ${theme.palette.primary.dark}`
                  }
                }}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={8} sx={{ mb: 6 }}>
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 4,
                  position: 'relative',
                  display: 'inline-block',
                  color: theme.palette.text.primary,
                  fontSize: { xs: 'h4.fontSize', sm: 'h3.fontSize', md: 'h2.fontSize' },
                  '&::after': {
                    content: '""',
                    display: 'inline-block',
                    width: '5px',
                    height: '1.2em',
                    backgroundColor: theme.palette.text.primary,
                    animation: 'blink 1s step-end infinite',
                    position: 'relative',
                    zIndex: 1
                  }
                }}
              >
                {typedTitle}
              </Typography>
              <Paper elevation={3} sx={{ 
                p: 3, 
                borderRadius: 4, 
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(145deg, #333333, #1c1c1c)' 
                  : 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                mb: 6
              }}>
                <Typography variant="body1" paragraph sx={{ color: theme.palette.text.primary }}>
                  Hello! I'm Alif Haikal Nayaza, an enthusiastic Informatics student at Telkom University. My passion lies in exploring the vast world of technology and creating innovative solutions that can make a difference.
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: theme.palette.text.primary }}>
                  My journey in tech has been an exhilarating adventure, filled with continuous learning and growth. From writing my first lines of code to developing complex applications, each step has been a valuable learning experience.
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                  I believe in the power of technology to transform lives and businesses. My goal is to contribute to this transformation by developing robust, scalable, and user-friendly applications.
                </Typography>
              </Paper>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {skills.map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: '16px',
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.common.white,
                      }
                    }} 
                  />
                ))}
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 4,
                  position: 'relative',
                  display: 'inline-block',
                  color: theme.palette.text.primary,
                  fontSize: { xs: 'h4.fontSize', sm: 'h3.fontSize', md: 'h2.fontSize' },
                  '&::after': {
                    content: '""',
                    display: 'inline-block',
                    width: '5px',
                    height: '1.2em',
                    backgroundColor: theme.palette.text.primary,
                    animation: 'blink 1s step-end infinite',
                    position: 'relative',
                    zIndex: 1
                  }
                }}
              >
                {typedSubtitle}
              </Typography>
              <Timeline align="alternate">
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <School />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                      Bachelor of Informatics
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Telkom University, Bandung, Indonesia (2021 - Present)
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <Work />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                      Web Developer Intern
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ABK Hospital (2024)
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <EmojiEvents />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                      Competitive Programming Participant
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Telkom University (2022)
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default AboutEducationPage;
