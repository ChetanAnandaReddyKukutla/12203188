import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { ContentCopy, CheckCircle } from '@mui/icons-material';
import { Log } from '../middleware/logger.js';
import urlService from '../services/urlService.js';

const UrlShortenerForm = ({ onUrlShortened }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    validityMinutes: 30,
    customShortCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = 'URL is required';
    } else if (!urlService.validateUrl(formData.originalUrl)) {
      newErrors.originalUrl = 'Please enter a valid URL';
    }

    if (formData.validityMinutes < 1 || formData.validityMinutes > 10080) {
      newErrors.validityMinutes = 'Validity must be between 1 and 10080 minutes';
    }

    if (formData.customShortCode && !urlService.validateShortCode(formData.customShortCode)) {
      newErrors.customShortCode = 'Short code must be alphanumeric';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    Log('UrlShortenerForm', 'INFO', 'url-shortener', 'Form submission started');

    if (!validateForm()) {
      Log('UrlShortenerForm', 'WARN', 'url-shortener', 'Form validation failed');
      return;
    }

    if (shortenedUrls.length >= 5) {
      setErrors({ general: 'Maximum 5 URLs can be shortened at once' });
      Log('UrlShortenerForm', 'WARN', 'url-shortener', 'Maximum URL limit reached');
      return;
    }

    setIsLoading(true);

    try {
      const result = await urlService.shortenUrl(
        formData.originalUrl,
        formData.validityMinutes,
        formData.customShortCode
      );

      const newShortenedUrl = {
        ...result,
        copied: false
      };

      setShortenedUrls(prev => [...prev, newShortenedUrl]);
      onUrlShortened(result);

      // Reset form
      setFormData({
        originalUrl: '',
        validityMinutes: 30,
        customShortCode: ''
      });

      Log('UrlShortenerForm', 'INFO', 'url-shortener', 'URL shortened and added to list');

    } catch (error) {
      setErrors({ general: error.message });
      Log('UrlShortenerForm', 'ERROR', 'url-shortener', `Form submission failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async (shortUrl, index) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setShortenedUrls(prev => 
        prev.map((url, i) => 
          i === index ? { ...url, copied: true } : url
        )
      );

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setShortenedUrls(prev => 
          prev.map((url, i) => 
            i === index ? { ...url, copied: false } : url
          )
        );
      }, 2000);

      Log('UrlShortenerForm', 'INFO', 'url-shortener', 'Short URL copied to clipboard');
    } catch (error) {
      Log('UrlShortenerForm', 'ERROR', 'url-shortener', 'Failed to copy URL to clipboard');
    }
  };

  const clearResults = () => {
    setShortenedUrls([]);
    Log('UrlShortenerForm', 'INFO', 'url-shortener', 'Results cleared');
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Shorten Your URL
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Enter URL to shorten"
            placeholder="https://example.com/very/long/url"
            value={formData.originalUrl}
            onChange={handleInputChange('originalUrl')}
            error={!!errors.originalUrl}
            helperText={errors.originalUrl}
            margin="normal"
            required
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Validity (minutes)"
              type="number"
              value={formData.validityMinutes}
              onChange={handleInputChange('validityMinutes')}
              error={!!errors.validityMinutes}
              helperText={errors.validityMinutes || 'Default: 30 minutes'}
              inputProps={{ min: 1, max: 10080 }}
              sx={{ flex: 1 }}
            />

            <TextField
              label="Custom Short Code (optional)"
              placeholder="abc123"
              value={formData.customShortCode}
              onChange={handleInputChange('customShortCode')}
              error={!!errors.customShortCode}
              helperText={errors.customShortCode || 'Alphanumeric only'}
              sx={{ flex: 1 }}
            />
          </Box>

          {errors.general && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.general}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>

            {shortenedUrls.length > 0 && (
              <Button variant="outlined" onClick={clearResults}>
                Clear Results
              </Button>
            )}
          </Box>
        </Box>

        {shortenedUrls.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Shortened URLs ({shortenedUrls.length}/5)
            </Typography>

            {shortenedUrls.map((url, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ flex: 1, mr: 2 }}>
                      {url.originalUrl}
                    </Typography>
                    {url.isCustom && (
                      <Chip label="Custom" size="small" color="primary" />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ flex: 1 }}>
                      {url.shortUrl}
                    </Typography>

                    <Tooltip title={url.copied ? 'Copied!' : 'Copy URL'}>
                      <IconButton
                        onClick={() => handleCopyUrl(url.shortUrl, index)}
                        color={url.copied ? 'success' : 'default'}
                        size="small"
                      >
                        {url.copied ? <CheckCircle /> : <ContentCopy />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Expires: {new Date(url.expiresAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlShortenerForm;
