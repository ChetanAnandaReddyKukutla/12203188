import { Log } from '../middleware/logger.js';

class UrlService {
  constructor() {
    this.baseUrl = 'https://api.short.ly/v1'; // Mock API base URL
    this.urls = new Map(); // In-memory storage for demo
    this.analytics = new Map(); // Analytics storage
    this.loadFromStorage();
    this.initializeMockData();
  }

  loadFromStorage() {
    try {
      const storedUrls = localStorage.getItem('urlShortener_urls');
      const storedAnalytics = localStorage.getItem('urlShortener_analytics');
      
      if (storedUrls) {
        const urlsData = JSON.parse(storedUrls);
        this.urls = new Map(urlsData);
      }
      
      if (storedAnalytics) {
        const analyticsData = JSON.parse(storedAnalytics);
        this.analytics = new Map(analyticsData);
      }
    } catch (error) {
      Log('UrlService', 'WARN', 'url-shortener', 'Failed to load from localStorage');
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('urlShortener_urls', JSON.stringify([...this.urls]));
      localStorage.setItem('urlShortener_analytics', JSON.stringify([...this.analytics]));
    } catch (error) {
      Log('UrlService', 'WARN', 'url-shortener', 'Failed to save to localStorage');
    }
  }

  initializeMockData() {
    // Only add mock data if no data exists in storage
    if (this.urls.size === 0) {
      // Add some mock data for demonstration
      const mockUrls = [
        {
          id: 'abc123',
          originalUrl: 'https://www.example.com/very/long/url/path',
          shortCode: 'abc123',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          expiresAt: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
          isCustom: false
        },
        {
          id: 'custom1',
          originalUrl: 'https://www.github.com/awesome-project',
          shortCode: 'custom1',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          expiresAt: new Date(Date.now() + 1800000).toISOString(), // 30 minutes from now
          isCustom: true
        },
        {
          id: 'youtube1',
          originalUrl: 'https://www.youtube.com/watch?v=mvY2ARC3oLs',
          shortCode: 'youtube1',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          isCustom: true
        }
      ];

      mockUrls.forEach(url => {
        this.urls.set(url.shortCode, url);
        this.analytics.set(url.shortCode, {
          clicks: Math.floor(Math.random() * 50),
          clickLogs: this.generateMockClickLogs(Math.floor(Math.random() * 10))
        });
      });
      
      // Save initial data to storage
      this.saveToStorage();
    }
  }

  generateMockClickLogs(count) {
    const logs = [];
    const referrers = ['direct', 'google.com', 'twitter.com', 'facebook.com', 'linkedin.com'];
    const locations = ['New York, US', 'London, UK', 'Toronto, CA', 'Sydney, AU', 'Tokyo, JP'];

    for (let i = 0; i < count; i++) {
      logs.push({
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
    }

    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  validateShortCode(shortCode) {
    return /^[a-zA-Z0-9]+$/.test(shortCode);
  }

  isShortCodeAvailable(shortCode) {
    return !this.urls.has(shortCode);
  }

  generateShortCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return this.isShortCodeAvailable(result) ? result : this.generateShortCode();
  }

  async shortenUrl(originalUrl, validityMinutes = 30, customShortCode = '') {
    Log('UrlService', 'INFO', 'url-shortener', `Attempting to shorten URL: ${originalUrl}`);

    try {
      // Validate URL
      if (!this.validateUrl(originalUrl)) {
        Log('UrlService', 'ERROR', 'url-shortener', 'Invalid URL provided');
        throw new Error('Invalid URL format');
      }

      // Handle custom short code
      let shortCode = customShortCode;
      if (customShortCode) {
        if (!this.validateShortCode(customShortCode)) {
          Log('UrlService', 'ERROR', 'url-shortener', 'Invalid custom short code format');
          throw new Error('Custom short code must be alphanumeric');
        }
        if (!this.isShortCodeAvailable(customShortCode)) {
          Log('UrlService', 'ERROR', 'url-shortener', 'Custom short code already exists');
          throw new Error('Custom short code already exists');
        }
      } else {
        shortCode = this.generateShortCode();
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + validityMinutes * 60000);

      const urlData = {
        id: shortCode,
        originalUrl,
        shortCode,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isCustom: !!customShortCode
      };

      // Store the URL
      this.urls.set(shortCode, urlData);
      this.analytics.set(shortCode, {
        clicks: 0,
        clickLogs: []
      });

      // Save to localStorage
      this.saveToStorage();

      Log('UrlService', 'INFO', 'url-shortener', `URL shortened successfully: ${shortCode}`);

      return {
        shortUrl: `${window.location.origin}/${shortCode}`,
        shortCode,
        originalUrl,
        expiresAt: expiresAt.toISOString(),
        createdAt: now.toISOString()
      };

    } catch (error) {
      Log('UrlService', 'ERROR', 'url-shortener', `URL shortening failed: ${error.message}`);
      throw error;
    }
  }

  async getUrlByShortCode(shortCode) {
    Log('UrlService', 'INFO', 'url-shortener', `Looking up short code: ${shortCode}`);

    const urlData = this.urls.get(shortCode);
    
    if (!urlData) {
      Log('UrlService', 'WARN', 'url-shortener', `Short code not found: ${shortCode}`);
      return null;
    }

    // Check if URL has expired
    if (new Date() > new Date(urlData.expiresAt)) {
      Log('UrlService', 'WARN', 'url-shortener', `Short code expired: ${shortCode}`);
      return null;
    }

    return urlData;
  }

  async recordClick(shortCode, referrer = 'direct') {
    Log('UrlService', 'INFO', 'url-shortener', `Recording click for: ${shortCode}`);

    const analytics = this.analytics.get(shortCode);
    if (analytics) {
      analytics.clicks += 1;
      analytics.clickLogs.unshift({
        timestamp: new Date().toISOString(),
        referrer,
        location: 'Unknown', // In a real app, this would be detected
        userAgent: navigator.userAgent
      });

      // Keep only last 100 click logs
      if (analytics.clickLogs.length > 100) {
        analytics.clickLogs = analytics.clickLogs.slice(0, 100);
      }
      
      // Save to localStorage after recording click
      this.saveToStorage();
    }
  }

  async getAllUrls() {
    Log('UrlService', 'INFO', 'url-shortener', 'Fetching all URLs');

    const urls = Array.from(this.urls.values());
    const urlsWithAnalytics = urls.map(url => ({
      ...url,
      analytics: this.analytics.get(url.shortCode) || { clicks: 0, clickLogs: [] }
    }));

    return urlsWithAnalytics.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getAnalytics(shortCode) {
    Log('UrlService', 'INFO', 'url-shortener', `Fetching analytics for: ${shortCode}`);

    const urlData = this.urls.get(shortCode);
    const analytics = this.analytics.get(shortCode);

    if (!urlData || !analytics) {
      return null;
    }

    return {
      ...urlData,
      ...analytics
    };
  }

  clearStorage() {
    localStorage.removeItem('urlShortener_urls');
    localStorage.removeItem('urlShortener_analytics');
    this.urls.clear();
    this.analytics.clear();
    this.initializeMockData();
    Log('UrlService', 'INFO', 'url-shortener', 'Storage cleared and reset to initial state');
  }
}

const urlService = new UrlService();
export default urlService;
