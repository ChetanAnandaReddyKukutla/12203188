import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import { ExitToApp, Home } from '@mui/icons-material';
import { Log } from '../middleware/logger.js';
import urlService from '../services/urlService.js';

const RedirectPage = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urlData, setUrlData] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode]);

  useEffect(() => {
    let timer;
    if (urlData && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (urlData && countdown === 0) {
      performRedirect();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, urlData]);

  const handleRedirect = async () => {
    try {
      Log('RedirectPage', 'INFO', 'redirect', `Attempting redirect for: ${shortCode}`);
      
      const url = await urlService.getUrlByShortCode(shortCode);
      
      if (!url) {
        setError('Short URL not found or has expired');
        Log('RedirectPage', 'WARN', 'redirect', `Short code not found: ${shortCode}`);
        setLoading(false);
        return;
      }

      // Record the click
      await urlService.recordClick(shortCode, document.referrer || 'direct');
      
      setUrlData(url);
      Log('RedirectPage', 'INFO', 'redirect', `Redirect prepared for: ${shortCode} -> ${url.originalUrl}`);
      
    } catch (err) {
      setError('Failed to process redirect');
      Log('RedirectPage', 'ERROR', 'redirect', `Redirect failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const performRedirect = () => {
    if (urlData) {
      Log('RedirectPage', 'INFO', 'redirect', `Redirecting to: ${urlData.originalUrl}`);
      window.location.href = urlData.originalUrl;
    }
  };

  const handleManualRedirect = () => {
    performRedirect();
  };

  const handleGoHome = () => {
    Log('RedirectPage', 'INFO', 'navigation', 'User chose to go home instead of redirecting');
    window.location.href = '/';
  };

  if (!shortCode) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Processing your request...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Looking up short code: <strong>{shortCode}</strong>
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {error}
                </Typography>
                <Typography variant="body2">
                  The short URL <strong>/{shortCode}</strong> could not be found or may have expired.
                </Typography>
              </Alert>

              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={handleGoHome}
                size="large"
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Redirecting in {countdown} seconds...
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              You will be redirected to:
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1, 
              mb: 3,
              wordBreak: 'break-all'
            }}>
              <Typography variant="body2" color="primary">
                {urlData?.originalUrl}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<ExitToApp />}
                onClick={handleManualRedirect}
                size="large"
              >
                Go Now
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={handleGoHome}
                size="large"
              >
                Cancel
              </Button>
            </Box>

            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              Short code: {shortCode}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default RedirectPage;
