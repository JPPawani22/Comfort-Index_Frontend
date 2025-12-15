export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  auth0: {
    domain: 'dev-ny7i3r0vz4ns70x3.us.auth0.com',
    clientId: 'j5XPzIJg8Q9OuHhxzwVAt2RjxqsBmvtc',
    authorizationParams: {
      redirect_uri: window.location.origin + '/callback',
      audience: 'https://weather-index.com'
    }
  },
  cache: {
    ttl: 600000 // 10 minutes in milliseconds
  }
};