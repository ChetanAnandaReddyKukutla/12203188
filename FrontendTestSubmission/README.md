# URL Shortener Web Application

A professional React.js application for URL shortening with analytics, built with Material-UI and modern web technologies.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, manageable links
- **Custom Short Codes**: Create personalized short codes (alphanumeric only)
- **Expiry Management**: Set custom expiration times (1 minute to 1 week)
- **Analytics Dashboard**: Track clicks, referrers, and user engagement
- **Real-time Statistics**: Monitor URL performance with detailed click logs
- **Client-side Routing**: Seamless navigation with React Router
- **Professional UI**: Material-UI components with responsive design
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Logging Middleware**: Integrated logging to remote service

## 🛠️ Technology Stack

- **Framework**: React.js 18 (Functional Components only)
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **UI Library**: Material-UI (MUI) v5
- **Icons**: Material-UI Icons
- **HTTP Client**: Native Fetch API
- **State Management**: React Hooks (useState, useEffect)

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. Navigate to the project directory:
   ```bash
   cd FrontendTestSubmission
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure logging credentials in `src/App.jsx`:
   ```javascript
   logger.updateCredentials({
     email: "your-email@university.edu",
     name: "Your Full Name",
     rollNo: "YOUR_ROLL_NUMBER",
     accessCode: "YOUR_ACCESS_CODE",
     clientID: "YOUR_CLIENT_ID",
     clientSecret: "YOUR_CLIENT_SECRET"
   });
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
FrontendTestSubmission/
├── public/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx
│   │   ├── Navigation.jsx
│   │   ├── UrlShortenerForm.jsx
│   │   └── UrlStatsTable.jsx
│   ├── middleware/
│   │   ├── auth.js
│   │   └── logger.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── RedirectPage.jsx
│   │   ├── ShortenPage.jsx
│   │   └── StatsPage.jsx
│   ├── services/
│   │   └── urlService.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Key Features

### URL Shortening
- Input validation for URLs and custom short codes
- Support for up to 5 URLs per session
- Custom expiry times (1 minute to 1 week)
- One-click copy functionality

### Analytics & Statistics
- Real-time click tracking
- Referrer analysis
- Geographic data (coarse location)
- Click timestamp logs
- URL status monitoring (active/expired)

### Navigation & Routing
- Client-side routing with React Router
- Dynamic redirects for short URLs
- Responsive navigation with mobile support
- Breadcrumb navigation

### Error Handling
- Global error boundary
- Form validation with user feedback
- Loading states and progress indicators
- Graceful error recovery

## 🔧 Configuration

### Logging Service
The application integrates with a remote logging service. Configure the endpoints in:
- `src/middleware/auth.js` - Authentication endpoint
- `src/middleware/logger.js` - Logging endpoint

### API Endpoints
- **Auth**: `POST http://20.244.56.144/evaluation-service/auth`
- **Logs**: `POST http://20.244.56.144/evaluation-service/logs`

## 📱 Usage

### Shortening URLs
1. Navigate to the "Shorten URL" page
2. Enter a valid URL
3. Optionally set custom short code and expiry time
4. Click "Shorten URL" to generate the short link
5. Copy the generated short URL

### Viewing Statistics
1. Navigate to the "Statistics" page
2. View all shortened URLs with their metrics
3. Click the expand icon to see detailed click logs
4. Monitor URL status and performance

### Redirects
- Visit `/{shortCode}` to be redirected to the original URL
- Automatic redirect with 5-second countdown
- Manual redirect option available
- Click tracking for analytics

## 🧪 Testing

The application includes comprehensive error handling and validation:
- URL format validation
- Short code uniqueness checking
- Expiry time validation
- Network error handling
- User input sanitization

## 🔒 Security Features

- Input validation and sanitization
- Secure token-based authentication
- HTTPS enforcement for external APIs
- XSS protection through React's built-in escaping

## 📊 Performance

- Lazy loading for optimal performance
- Efficient state management
- Minimal re-renders with proper React patterns
- Optimized bundle size with Vite

## 🎨 UI/UX Features

- Responsive design for all device sizes
- Material Design principles
- Consistent color scheme and typography
- Intuitive user interface
- Loading states and progress indicators
- Toast notifications for user actions

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the logging service endpoints allow cross-origin requests
2. **Authentication Failures**: Verify credentials in `src/App.jsx`
3. **Build Errors**: Check Node.js version compatibility

### Development Mode
- Logging falls back to console in development
- Error details shown in error boundary
- Hot module replacement for faster development

## 📄 License

This project is created for educational purposes as part of a technical assessment.

## 🤝 Contributing

This is an assessment project. Please refer to the assignment guidelines for submission requirements.
