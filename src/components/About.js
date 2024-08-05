import React from 'react';
import { Container, Typography, Box, Paper, Grid, Avatar, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const About = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

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

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Avatar
            alt="Profile Picture"
            src="/images/profil.jpg"
            sx={{
              width: 180,
              height: 180,
              mb: 3,
              border: `4px solid ${theme.palette.primary.main}`,
              boxShadow: `0 8px 16px ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
              borderRadius: '50%',
              margin: 'auto',
            }}
          />
          <MotionTypography 
            variant="h3" 
            component="h1" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            sx={{ 
              fontWeight: 'bold', 
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About Me
          </MotionTypography>
          <MotionTypography
            variant="h6"
            color="textSecondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Exploring the World of Web Development and Data Analysis
          </MotionTypography>
        </MotionBox>

        <Grid container spacing={4}>
          {/* Background Section */}
          <Grid item xs={12}>
            <MotionPaper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                mb: 4,
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 80, delay: 0.2 }}
            >
              <MotionTypography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <CodeIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> My Background
              </MotionTypography>
              <MotionTypography variant="body1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
                I am a passionate student currently pursuing my studies at Telkom University. My expertise lies in website creation and data analysis, with a particular focus on data visualization using Jupyter. Recently, I've delved into the MERN stack (MongoDB, Express.js, React.js, and Node.js), applying this technology in my latest projects. Additionally, I've had the opportunity to work on a significant group project involving mobile application development, further expanding my skillset in the world of software development.
              </MotionTypography>
            </MotionPaper>
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12} md={6}>
            <MotionPaper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                mb: 4,
                borderRadius: '16px',
                height: '100%',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 80, delay: 0.4 }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <CodeIcon sx={{ mr: 1, color: theme.palette.secondary.main }} /> Skills
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0, listStyleType: 'none' }}>
                {['Python','HTML, CSS, JavaScript', 'React.js, Context API', 'Node.js, Express', 'MongoDB, SQL', 'Git, GitHub', 'Responsive Web Design', 'Data Analysis', 'Data Visualization'].map((skill, index) => (
                  <motion.li 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    style={{ marginBottom: '8px' }}
                  >
                    • {skill}
                  </motion.li>
                ))}
              </ul>
            </MotionPaper>
          </Grid>

          {/* Education */}
          <Grid item xs={12} md={6}>
            <MotionPaper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: '16px',
                height: '100%',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 80, delay: 0.6 }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1, color: theme.palette.info.main }} /> Education
              </Typography>
              <MotionTypography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                Bachelor of Science in Computer Science
              </MotionTypography>
              <MotionTypography variant="body1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
                <strong>University:</strong> Telkom University
                <br />
                <strong>Duration:</strong> 2021 - Present
                <br />
                <strong>Focus Areas:</strong> Software Engineering, Database Management, Web Development, Data Analysis
              </MotionTypography>
            </MotionPaper>
          </Grid>

          {/* Projects / Experience */}
          <Grid item xs={12}>
            <MotionPaper
              elevation={3}
              sx={{
                p: 4,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: '16px',
                height: '100%',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 80, delay: 0.8 }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <WorkIcon sx={{ mr: 1, color: theme.palette.success.main }} /> Projects & Experience
              </Typography>
              <MotionTypography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                Group Project: Mobile Application Development
              </MotionTypography>
              <MotionTypography variant="body1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}>
                Participated in a significant group project focusing on the development of a mobile application, contributing to various aspects such as UI/UX design, backend integration, and testing.
              </MotionTypography>
              <MotionTypography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 'bold', mt: 3 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                MERN Stack Projects
              </MotionTypography>
              <MotionTypography variant="body1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.6 }}>
                Developed several web applications using the MERN (MongoDB, Express.js, React.js, Node.js) stack, applying best practices in modern web development.
              </MotionTypography>
            </MotionPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
