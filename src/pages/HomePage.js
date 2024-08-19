import React from 'react';
import { Typography, Container, Grid, Button, LinearProgress, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { GitHub, LinkedIn, Instagram, Code, Storage } from '@mui/icons-material';

function HomePage() {
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

  const skills = [
    { name: 'Python', level: 70, icon: <Code />, color: '#3776AB' },
    { name: 'React.js', level: 70, icon: <Code />, color: '#61DAFB' },
    { name: 'Node.js', level: 73, icon: <Storage />, color: '#339933' },
    { name: 'JavaScript', level: 65, icon: <Code />, color: '#F7DF1E' },
    { name: 'HTML/CSS', level: 75, icon: <Code />, color: '#E34F26' },
    { name: 'MongoDB', level: 62, icon: <Storage />, color: '#47A248' },
    { name: 'MySQL', level: 76, icon: <Storage />, color: '#4479A1' },
    { name: 'Jupyter', level: 79, icon: <Code />, color: '#F37626' },
  ];

  return (
    <Container maxWidth="lg" component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      <Grid container spacing={4} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 2 }}>
              <TypeAnimation
                sequence={['Welcome to My Portfolio', 1000]}
                wrapper="span"
                cursor={true}
                repeat={1}
              />
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: theme.palette.text.secondary }}>
              <TypeAnimation
                sequence={["I'm Alif Haikal Nayaza. Full-stack developer. Tech enthusiast.", 1000]}
                wrapper="span"
                cursor={true}
                repeat={1}
              />
            </Typography>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>About Me</Typography>
            <Typography variant="body1" paragraph sx={{ color: theme.palette.text.primary }}>
              I'm a passionate full-stack developer, dedicated to crafting efficient and innovative solutions. Always eager to learn and adapt, I thrive on challenges that push the boundaries of technology.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/about"
              sx={{
                borderRadius: 30,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Learn More
            </Button>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 3 }}>My Skills</Typography>
            <Grid container spacing={2}>
              {skills.map((skill, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', mb: 1, color: theme.palette.text.primary }}>
                    {React.cloneElement(skill.icon, { style: { marginRight: 8, color: skill.color } })}
                    {skill.name}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={skill.level} 
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${skill.color} 100%)`,
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mt: 4, textAlign: 'center' }}>Let's Connect</Typography>
            <Grid container justifyContent="center" spacing={2} sx={{ mb: 3 }}>
              <Grid item>
                <IconButton 
                  component="a" 
                  href="https://github.com/AlifNayaza" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    color: theme.palette.text.primary,
                    '&:hover': { color: theme.palette.primary.main, transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                  }}
                >
                  <GitHub fontSize="large" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton 
                  component="a" 
                  href="https://www.linkedin.com/in/alif-haikal-nayaza-a5b587241/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    color: theme.palette.text.primary,
                    '&:hover': { color: theme.palette.primary.main, transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                  }}
                >
                  <LinkedIn fontSize="large" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton 
                  component="a" 
                  href="https://www.instagram.com/alraf26_/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    color: theme.palette.text.primary,
                    '&:hover': { color: theme.palette.primary.main, transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                  }}
                >
                  <Instagram fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                component={Link}
                to="/contact"
                sx={{
                  borderRadius: 30,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Contact Me
              </Button>
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage; 
