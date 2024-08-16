import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Grid, Card, CardContent, CardMedia, Box, Button, Chip, useTheme, useMediaQuery, Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';

// Import images explicitly
import project1 from '../images/project1.png';
import project2 from '../images/project2.png';
import project3 from '../images/project3.png';

// Import slick-carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ProjectPage() {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const projects = [
    { id: 1, title: 'BeritaCepat Portal Website', description: 'This is a news website that functions like a typical news website where there is current news and trending news.', images: [project1, project2, project3], technologies: ['HtML/CSS', 'Javascript', 'Laravel', 'MySQL'] },
    { id: 2, title: 'Visualization of Covid Active Cases in Indonesia', description: 'This image is a heatmap visualization of active covid cases in Indonesia created using python and jupyter notebook.', images: [project2, project1, project3], technologies: ['Python', 'Jupyter Notebook'] },
    { id: 3, title: 'PasarSae Mobile Application', description: 'PasarSae is a mobile application design that serves to view market information in Bandung ranging from prices, locations, and available stock items.', images: [project3, project1, project2], technologies: ['Flutter', 'Firebase'] },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const hoverEffect = {
    scale: 1.03,
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 10px 20px rgba(255, 255, 255, 0.1)'
      : '0 10px 20px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3, ease: 'easeInOut' },
  };

  const [typedTitle, setTypedTitle] = useState('');
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const titleText = "My Projects";
  const subtitleText = "Project Details";

  useEffect(() => {
    typeText(titleText, setTypedTitle);
  }, []);

  useEffect(() => {
    if (id) {
      const project = projects.find(p => p.id === parseInt(id));
      setProjectTitle(project.title);
      typeText(subtitleText, setTypedSubtitle);
    }
  }, [id]);

  const typeText = (text, setter, delay = 50) => {
    let index = 0;
    const interval = setInterval(() => {
      setter(text.slice(0, index + 1));
      index += 1;
      if (index > text.length) {
        clearInterval(interval);
      }
    }, delay);
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  const handleImageClick = (image, event) => {
    event.stopPropagation();
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (id) {
    const project = projects.find(p => p.id === parseInt(id));
    return (
      <Container maxWidth="lg">
        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{ py: 12, textAlign: 'center' }}
        >
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}
          >
            {typedTitle}
          </Typography>
          <Typography 
            variant="h4" 
            paragraph 
            sx={{ mb: 6, color: 'text.secondary' }}
          >
            {typedSubtitle}
          </Typography>
          <Typography 
            variant="h3" 
            paragraph 
            sx={{ mb: 6, color: 'text.primary' }}
          >
            {projectTitle}
          </Typography>
          <Box sx={{ maxWidth: '800px', margin: '0 auto', mb: 6 }}>
            <Slider {...settings}>
              {project.images.map((image, index) => (
                <Box key={index} sx={{ p: 2 }}>
                  <img 
                    src={image} 
                    alt={project.title} 
                    style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }} 
                    onClick={(event) => handleImageClick(image, event)}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            {project.description}
          </Typography>
          <Box sx={{ mb: 4 }}>
            {project.technologies.map((tech, index) => (
              <Chip 
                key={index}
                label={tech}
                sx={{ mr: 1, mb: 1, backgroundColor: 'background.paper', color: 'text.primary' }}
              />
            ))}
          </Box>
          <Button 
            component={Link} 
            to="/projects" 
            variant="outlined"
            sx={{ mt: 2, borderColor: 'text.primary', color: 'text.primary', '&:hover': { backgroundColor: 'text.primary', color: 'background.default' } }}
          >
            Back to Projects
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box 
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 12, textAlign: 'center' }}
      >
        <Typography 
          variant="h2" 
          gutterBottom 
          sx={{ mb: 8, fontWeight: 'bold', color: 'text.primary' }}
        >
          {typedTitle}
        </Typography>
        <Grid container spacing={4}>
          <AnimatePresence>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={hoverEffect}
                  onClick={() => handleCardClick(project)}
                  style={{ height: '100%' }}
                >
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    boxShadow: theme.palette.mode === 'dark' ? '0 4px 10px rgba(255,255,255,0.1)' : '0 4px 10px rgba(0,0,0,0.1)',
                    backgroundColor: 'background.paper'
                  }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={project.images[0]}
                      alt={project.title}
                      onClick={(event) => handleImageClick(project.images[0], event)}
                      sx={{ cursor: 'pointer' }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Typography variant="h5" component="div" sx={{ mb: 2, color: 'text.primary' }}>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {project.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {project.technologies.map((tech, index) => (
                          <Chip 
                            key={index}
                            label={tech}
                            sx={{ mr: 1, mb: 1, backgroundColor: 'background.default', color: 'text.primary' }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="image-modal"
        aria-describedby="full-size-image"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <img 
            src={selectedImage} 
            alt="Full size" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain' 
            }} 
          />
        </Box>
      </Modal>
    </Container>
  );
}

export default ProjectPage;