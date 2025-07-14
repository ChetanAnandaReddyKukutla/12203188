const AUTH_API_URL = 'http://20.244.56.144/evaluation-service/auth';

class TokenManager {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  async fetchToken(credentials) {
    try {
      const response = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      this.token = data.token;
      this.tokenExpiry = Date.now() + (data.expiresIn || 3600) * 1000;
      
      return this.token;
    } catch (error) {
      throw new Error(`Failed to authenticate: ${error.message}`);
    }
  }

  async getValidToken(credentials) {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    return await this.fetchToken(credentials);
  }

  clearToken() {
    this.token = null;
    this.tokenExpiry = null;
  }
}

const tokenManager = new TokenManager();

export default tokenManager;
