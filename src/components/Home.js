import React from 'react';
import { Container, Typography, Box, Button, Grid, useTheme, Paper, LinearProgress } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import SpeedIcon from '@mui/icons-material/Speed';

const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionPaper = motion(Paper);

const SkillCard = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <MotionPaper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {icon}
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {description}
      </Typography>
    </MotionPaper>
  );
};

const SkillBar = ({ skill, level }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body1" sx={{ mb: 1 }}>
      {skill}
    </Typography>
    <LinearProgress variant="determinate" value={level} sx={{ height: 8, borderRadius: 5 }} />
  </Box>
);

const Home = () => {
  const theme = useTheme();
  
  const [heroRef, inViewHero] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [skillsRef, inViewSkills] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contactRef, inViewContact] = useInView({ triggerOnce: true, threshold: 0.1 });

  const heroControls = useAnimation();
  const skillsControls = useAnimation();
  const contactControls = useAnimation();

  if (inViewHero) {
    heroControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' }
    });
  }

  if (inViewSkills) {
    skillsControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' }
    });
  }

  if (inViewContact) {
    contactControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' }
    });
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background shapes */}
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
        {[...Array(20)].map((_, index) => (
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
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ py: 6, textAlign: 'center' }} ref={heroRef}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroControls}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to My Portfolio
            </Typography>
            <MotionTypography
              variant="h5"
              color="textSecondary"
              initial={{ opacity: 0, y: 30 }}
              animate={heroControls}
              transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
            >
              I am a developer with expertise in Web Development and Data Analysis
            </MotionTypography>
          </motion.div>
        </Box>

        {/* Skills and Services Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <SkillCard
              icon={<CodeIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />}
              title="Web Development"
              description="Building responsive and modern websites using the latest technologies."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SkillCard
              icon={<DataUsageIcon sx={{ fontSize: 50, color: theme.palette.secondary.main }} />}
              title="Data Analysis"
              description="Analyzing data to provide insights and support decision-making processes."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SkillCard
              icon={<SpeedIcon sx={{ fontSize: 50, color: theme.palette.error.main }} />}
              title="Performance"
              description="Optimizing websites for speed and efficiency."
            />
          </Grid>
        </Grid>

        {/* Skills Progress Section */}
        <Box sx={{ mb: 8 }} ref={skillsRef}>
          <MotionTypography
            variant="h4"
            align="center"
            initial={{ opacity: 0, y: 30 }}
            animate={skillsControls}
            transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
            sx={{ 
              mb: 4, 
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Skills
          </MotionTypography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <SkillBar skill="HTML" level={60} />
              <SkillBar skill="CSS" level={50} />
              <SkillBar skill="JavaScript" level={55} />
              <SkillBar skill="Python" level={60} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SkillBar skill="React.js" level={60} />
              <SkillBar skill="Node.js" level={55} />
              <SkillBar skill="MongoDB" level={65} />
            </Grid>
          </Grid>
        </Box>

        {/* Contact Button */}
        <Box sx={{ textAlign: 'center', pb: 6 }} ref={contactRef}>
          <MotionButton
            variant="contained"
            component={RouterLink}
            to="/contact"
            size="large"
            initial={{ opacity: 0, y: 30 }}
            animate={contactControls}
            whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 105, 135, .5)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              border: 0,
              borderRadius: 3,
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              color: 'white',
              padding: '12px 30px',
              fontWeight: 'bold',
            }}
          >
            Get in Touch
          </MotionButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
