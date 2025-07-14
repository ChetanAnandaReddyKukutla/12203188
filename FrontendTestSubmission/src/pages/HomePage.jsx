import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Paper
} from '@mui/material';
import { 
  Link as LinkIcon, 
  Analytics, 
  Speed, 
  Security,
  TrendingUp,
  Timer
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Log } from '../middleware/logger.js';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Log('HomePage', 'INFO', 'app', 'Home page loaded');
  }, []);

  const handleGetStarted = () => {
    Log('HomePage', 'INFO', 'navigation', 'User clicked Get Started button');
    navigate('/shorten');
  };

  const handleViewStats = () => {
    Log('HomePage', 'INFO', 'navigation', 'User clicked View Statistics button');
    navigate('/stats');
  };

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40 }} color="primary" />,
      title: 'Lightning Fast',
      description: 'Shorten URLs instantly with our optimized service'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} color="primary" />,
      title: 'Secure & Reliable',
      description: 'Your URLs are safe with enterprise-grade security'
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} color="primary" />,
      title: 'Detailed Analytics',
      description: 'Track clicks, referrers, and geographic data'
    },
    {
      icon: <Timer sx={{ fontSize: 40 }} color="primary" />,
      title: 'Custom Expiry',
      description: 'Set custom expiration times for your links'
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          URL Shortener
        </Typography>
        
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
        >
          Transform long, complex URLs into short, shareable links with 
          detailed analytics and custom features
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LinkIcon />}
            onClick={handleGetStarted}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<TrendingUp />}
            onClick={handleViewStats}
            sx={{ px: 4, py: 1.5 }}
          >
            View Statistics
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Why Choose Our URL Shortener?
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          paragraph
          sx={{ mb: 6 }}
        >
          Powerful features designed for modern web applications
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Statistics Preview */}
      <Box sx={{ py: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
            Join thousands of users who trust our URL shortening service
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" component="div" fontWeight="bold">
                5
              </Typography>
              <Typography variant="body1">URLs per session</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" component="div" fontWeight="bold">
                30min
              </Typography>
              <Typography variant="body1">Default validity</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h3" component="div" fontWeight="bold">
                100%
              </Typography>
              <Typography variant="body1">Uptime guaranteed</Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Start Shortening URLs
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
