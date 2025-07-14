import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Fab } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import UrlShortenerForm from '../components/UrlShortenerForm.jsx';
import { Log } from '../middleware/logger.js';

const ShortenPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    Log('ShortenPage', 'INFO', 'app', 'URL shortener page loaded');
  }, []);

  const handleUrlShortened = (result) => {
    Log('ShortenPage', 'INFO', 'url-shortener', `New URL shortened: ${result.shortCode}`);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    Log('ShortenPage', 'INFO', 'app', 'Page refreshed by user');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Shorten Your URLs
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          paragraph
          sx={{ mb: 4 }}
        >
          Create short, manageable links from long URLs. Add custom short codes, 
          set expiry times, and track your link performance.
        </Typography>

        <UrlShortenerForm key={refreshKey} onUrlShortened={handleUrlShortened} />
      </Box>

      <Fab
        color="primary"
        aria-label="refresh"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
        onClick={handleRefresh}
      >
        <Refresh />
      </Fab>
    </Container>
  );
};

export default ShortenPage;
