import React from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Typography,
  Container
} from '@mui/material';
import { Refresh, Home } from '@mui/icons-material';
import { Log } from '../middleware/logger.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log the error
    Log('ErrorBoundary', 'ERROR', 'app', `Error caught: ${error.message}`);
  }

  handleReload = () => {
    Log('ErrorBoundary', 'INFO', 'app', 'User triggered page reload from error boundary');
    window.location.reload();
  };

  handleGoHome = () => {
    Log('ErrorBoundary', 'INFO', 'app', 'User navigated to home from error boundary');
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Oops! Something went wrong</AlertTitle>
            <Typography variant="body1" gutterBottom>
              We're sorry, but something unexpected happened. This error has been logged 
              and our team will look into it.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Error Details (Development Mode):
                </Typography>
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReload}
            >
              Reload Page
            </Button>
            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={this.handleGoHome}
            >
              Go to Home
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
