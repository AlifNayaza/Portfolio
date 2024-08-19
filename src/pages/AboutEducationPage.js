import React, { useState, useEffect, useRef } from 'react';
import { Typography, Container, Box, Grid, Paper, useTheme, Avatar, Chip, Dialog, DialogContent, IconButton } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { School, Work, EmojiEvents } from '@mui/icons-material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import profileImage from '../images/profil2.jpg';
import CloseIcon from '@mui/icons-material/Close';

function AboutEducationPage() {
  const theme = useTheme();
  const timelineRef = useRef(null);
  const isInView = useInView(timelineRef, { once: true, amount: 0.2 });

  const [dialogOpen, setDialogOpen] = useState(false);

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

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  };

  const timelineItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
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

  const skills = [
    'JavaScript', 'React', 'Node.js', 'Python', 
    'MySQL', 'Jupyter', 'MongoDB', 
    'HTML', 'CSS'
  ];

  const handleAvatarClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
                onClick={handleAvatarClick}
                sx={{ 
                  width: { xs: 180, sm: 220, md: 260 },
                  height: { xs: 180, sm: 220, md: 260 },
                  border: `8px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 8px 16px ${theme.palette.primary.dark}`,
                  position: 'relative',
                  zIndex: 1,
                  cursor: 'pointer', // Add cursor pointer to indicate clickability
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
                    boxShadow: `0 12px 24px ${theme.palette.primary.dark}`,
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
                  color: theme.palette.primary.main,
                  fontSize: { xs: 'h4.fontSize', sm: 'h3.fontSize', md: 'h2.fontSize' },
                  '&::after': {
                    content: '""',
                    display: 'inline-block',
                    width: '5px',
                    height: '1.2em',
                    backgroundColor: theme.palette.primary.main,
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
                mb: 6,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}>
                <Typography variant="body1" paragraph sx={{ color: theme.palette.text.primary }}>
                  Hello! I'm Alif Haikal Nayaza, a passionate Informatics student at Telkom University. I'm dedicated to exploring technology and crafting innovative solutions that create meaningful impact.
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: theme.palette.text.primary }}>
                  My journey in technology has been exciting and transformative. From my first coding experiences to developing sophisticated applications, each step has contributed to my growth.
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                  I am committed to leveraging technology to improve lives and drive positive change through creating reliable, scalable, and user-centric applications.
                </Typography>
              </Paper>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {skills.map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    color="default" // Use default color to control background manually
                    sx={{ 
                      mb: 1,
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.background.paper // Light background in dark mode
                        : theme.palette.grey[200], // Light grey background in light mode
                      color: theme.palette.text.primary, // Black text
                      '& .MuiChip-label': {
                        color: theme.palette.text.primary // Ensure text color is black
                      }
                    }} 
                  />
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.primary.main,
              mb: 2
            }}
          >
            {typedSubtitle}
          </Typography>
          <motion.div 
            variants={timelineVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            ref={timelineRef}
          >
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <School />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <motion.div variants={timelineItemVariants}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                      Bachelor of Science in Informatics
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Telkom University
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      2021- Present
                    </Typography>
                  </motion.div>
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
                  <motion.div variants={timelineItemVariants}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                      Web Developer Intern
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Anugerah Bunda Khatulistiwa Hospital
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      2024
                    </Typography>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <EmojiEvents />
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent>
                  <motion.div variants={timelineItemVariants}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                      Competitive Programming Participant
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Telkom University
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      2022
                    </Typography>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </motion.div>
        </Box>
      </Box>

      {/* Dialog for full-size image */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <img 
            src={profileImage} 
            alt="Profile" 
            style={{ width: '100%', height: 'auto' }} 
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default AboutEducationPage;
