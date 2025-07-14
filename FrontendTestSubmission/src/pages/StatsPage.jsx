import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Fab } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import UrlStatsTable from '../components/UrlStatsTable.jsx';
import { Log } from '../middleware/logger.js';

const StatsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    Log('StatsPage', 'INFO', 'app', 'Statistics page loaded');
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    Log('StatsPage', 'INFO', 'app', 'Statistics refreshed by user');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          URL Analytics & Statistics
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          paragraph
          sx={{ mb: 4 }}
        >
          Monitor your shortened URLs performance, track clicks, and analyze 
          user engagement with detailed analytics.
        </Typography>

        <UrlStatsTable key={refreshKey} />
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

export default StatsPage;
