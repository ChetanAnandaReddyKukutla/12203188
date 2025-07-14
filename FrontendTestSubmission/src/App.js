import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

import Navigation from './components/Navigation.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import HomePage from './pages/HomePage.jsx';
import ShortenPage from './pages/ShortenPage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import RedirectPage from './pages/RedirectPage.jsx';

import logger, { Log } from './middleware/logger.js';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize logging with user credentials
    // In a real application, these would come from user input or environment variables
    logger.updateCredentials({
      email: "student@university.edu",
      name: "John Doe",
      rollNo: "CS123456789",
      accessCode: "ACCESS_CODE_HERE", 
      clientID: "CLIENT_ID_HERE",
      clientSecret: "CLIENT_SECRET_HERE"
    });

    Log('App', 'INFO', 'app', 'Application started');
    
    return () => {
      Log('App', 'INFO', 'app', 'Application shutting down');
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navigation />
            
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shorten" element={<ShortenPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/:shortCode" element={<RedirectPage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
