# Logging Middleware

A lightweight logging utility for React applications that sends logs to a remote logging service.

## Features

- Token-based authentication with automatic token management
- Batch processing of logs for better performance
- Multiple log levels (INFO, ERROR, WARN, DEBUG)
- Automatic retry mechanism for failed requests
- Development fallback to console logging

## Installation

Copy the `auth.js` and `log.js` files to your project's middleware directory.

## Usage

### Basic Setup

```javascript
import logger, { Log } from './middleware/log.js';

// Update credentials (do this once at app startup)
logger.updateCredentials({
  email: "your-email@example.com",
  name: "Your Name",
  rollNo: "your-roll-number",
  accessCode: "your-access-code",
  clientID: "your-client-id",
  clientSecret: "your-client-secret"
});
```

### Logging Messages

```javascript
// Basic logging
Log('ComponentName', 'INFO', 'url-shortener', 'URL shortened successfully');

// Using convenience methods
logger.info('ComponentName', 'url-shortener', 'User navigated to stats page');
logger.error('ComponentName', 'url-shortener', 'Failed to validate URL');
logger.warn('ComponentName', 'url-shortener', 'Custom shortcode already exists');
logger.debug('ComponentName', 'url-shortener', 'Form validation started');
```

### Parameters

- **stack**: The component or function name where the log originates
- **level**: Log level (INFO, ERROR, WARN, DEBUG)
- **package**: The module or feature name (e.g., 'url-shortener', 'auth', 'navigation')
- **message**: The log message

## Configuration

### Authentication Credentials

Update the credentials in your main app file:

```javascript
import logger from './LoggingMiddleware/log.js';

logger.updateCredentials({
  email: "student@university.edu",
  name: "John Doe",
  rollNo: "CS123456",
  accessCode: "SECRET_ACCESS_CODE",
  clientID: "CLIENT_ID",
  clientSecret: "CLIENT_SECRET"
});
```

### Environment Variables

The logger respects the `NODE_ENV` environment variable:
- In development mode, failed logs fall back to console output
- In production mode, logs are only sent to the remote service

## Error Handling

The logging middleware includes built-in error handling:
- Automatic token refresh when tokens expire
- Retry mechanism for failed log requests
- Graceful fallback in development environments

## API Endpoints

- **Auth Endpoint**: `POST http://20.244.56.144/evaluation-service/auth`
- **Logging Endpoint**: `POST http://20.244.56.144/evaluation-service/logs`

## Best Practices

1. Use descriptive stack names that indicate the component or function
2. Choose appropriate log levels:
   - `INFO`: General application flow
   - `ERROR`: Error conditions
   - `WARN`: Warning conditions
   - `DEBUG`: Detailed debugging information

3. Use consistent package names for better log organization
4. Keep log messages concise but informative

## Example Integration

```javascript
// In a React component
import { Log } from '../middleware/log.js';

const UrlShortener = () => {
  const handleShortenUrl = async (url) => {
    try {
      Log('UrlShortener', 'INFO', 'url-shortener', 'Starting URL shortening process');
      
      const result = await shortenUrl(url);
      
      Log('UrlShortener', 'INFO', 'url-shortener', 'URL shortened successfully');
      return result;
    } catch (error) {
      Log('UrlShortener', 'ERROR', 'url-shortener', `URL shortening failed: ${error.message}`);
      throw error;
    }
  };
};
```
