import React, { useState } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Grid, useTheme, Modal, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Close as CloseIcon } from '@mui/icons-material';

const MotionCard = motion(Card);

const projects = [
  { id: 1, title: 'Covid Active Case Visualization', description: 'This is a data visualization of active covid cases in Indonesia.', image: '/images/kasus_aktif_covid.png', technologies: ['HTML', 'CSS', 'JavaScript'] },
  { id: 2, title: 'PasarSae Mobile Application', description: 'PasarSae is a mobile application that serves to facilitate users to monitor market information in Bandung.', image: '/images/market.png', technologies: ['Flutter', 'Firebase', 'Google Maps API'] },
  { id: 3, title: 'BeritaCepat Portal Website', description: 'BeritaCepat is a website that serves to view and create the latest news.', image: '/images/berita.png', technologies: ['HTML', 'CSS', 'Javascript', 'Laravel', 'MySQL'] },
];

const ProjectCard = ({ project, index, onClick }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Grid item key={project.id} xs={12} sm={6} md={4}>
      <MotionCard
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: index * 0.1 }}
        whileHover={{
          scale: 1.05,
          boxShadow: `0px 12px 24px ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
          transform: 'translateY(-10px)',
        }}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: `0 8px 32px ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          transition: 'all 0.3s ease',
          margin: '10px',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        onClick={() => onClick(project.image)}
      >
        <CardMedia
          component="img"
          image={project.image}
          alt={project.title}
          sx={{
            height: 200,
            objectFit: 'cover',
            width: '100%',
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {project.title}
          </Typography>
          <Typography variant="body2" paragraph>
            {project.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {project.technologies.map((tech, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                }}
              >
                {tech}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </MotionCard>
    </Grid>
  );
};

const Projects = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
      overflow: 'hidden',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ my: 8, position: 'relative' }}>
          {/* Animated background shapes */}
          {[...Array(10)].map((_, index) => (
            <Box
              key={index}
              component={motion.div}
              sx={{
                position: 'absolute',
                width: Math.random() * 20 + 10,
                height: Math.random() * 20 + 10,
                borderRadius: '50%',
                background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`,
                zIndex: 0,
              }}
              animate={{
                x: ['-100%', '100%'],
                y: ['-100%', '100%'],
              }}
              transition={{
                duration: Math.random() * 10 + 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
          <Typography 
            variant="h2" 
            component="h1" 
            align="center" 
            gutterBottom 
            sx={{
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 6,
              position: 'relative',
              zIndex: 1,
            }}
          >
            My Projects
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} onClick={handleOpen} />
            ))}
          </Grid>
        </Box>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 'auto',
            height: 'auto',
            maxWidth: '90%',
            maxHeight: '90%',
            backgroundColor: theme.palette.background.paper,
            boxShadow: 24,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: theme.palette.text.primary,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <CardMedia
            component="img"
            image={selectedImage}
            alt="Project Image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Projects;
