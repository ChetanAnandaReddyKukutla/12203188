import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  Link, 
  Schedule, 
  Analytics,
  Visibility
} from '@mui/icons-material';
import { Log } from '../middleware/logger.js';
import urlService from '../services/urlService.js';

const UrlStatsTable = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    loadUrlStats();
  }, []);

  const loadUrlStats = async () => {
    try {
      Log('UrlStatsTable', 'INFO', 'url-shortener', 'Loading URL statistics');
      setLoading(true);
      const urlStats = await urlService.getAllUrls();
      setUrls(urlStats);
      Log('UrlStatsTable', 'INFO', 'url-shortener', `Loaded ${urlStats.length} URL statistics`);
    } catch (err) {
      setError('Failed to load URL statistics');
      Log('UrlStatsTable', 'ERROR', 'url-shortener', `Failed to load statistics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (shortCode) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shortCode)) {
        newSet.delete(shortCode);
      } else {
        newSet.add(shortCode);
      }
      return newSet;
    });

    Log('UrlStatsTable', 'INFO', 'url-shortener', `Toggled expansion for: ${shortCode}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
  };

  const getStatusChip = (url) => {
    if (isExpired(url.expiresAt)) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    
    const timeLeft = new Date(url.expiresAt) - new Date();
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    
    if (hoursLeft < 1) {
      return <Chip label="Expires Soon" color="warning" size="small" />;
    }
    
    return <Chip label="Active" color="success" size="small" />;
  };

  if (loading) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading URL statistics...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (urls.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Analytics sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No URLs found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shorten some URLs to see statistics here
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          URL Statistics
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Short Code</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Clicks</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <React.Fragment key={url.shortCode}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(url.shortCode)}
                        disabled={!url.analytics?.clickLogs?.length}
                      >
                        {expandedRows.has(url.shortCode) ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Link fontSize="small" />
                        <Typography variant="body2" fontFamily="monospace">
                          {url.shortCode}
                        </Typography>
                        {url.isCustom && (
                          <Chip label="Custom" size="small" color="primary" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={url.originalUrl}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {url.originalUrl}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(url)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Visibility fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight="bold">
                          {url.analytics?.clicks || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(url.createdAt)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={isExpired(url.expiresAt) ? 'error.main' : 'text.primary'}
                      >
                        {formatDate(url.expiresAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 0 }}>
                      <Collapse in={expandedRows.has(url.shortCode)} timeout="auto">
                        <Box sx={{ py: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Click Logs
                          </Typography>
                          
                          {url.analytics?.clickLogs?.length > 0 ? (
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Referrer</TableCell>
                                    <TableCell>Location</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {url.analytics.clickLogs.slice(0, 10).map((log, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {formatDate(log.timestamp)}
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={log.referrer}
                                          size="small"
                                          variant="outlined"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {log.location}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No clicks recorded yet
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default UrlStatsTable;
