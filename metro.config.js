const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Allow all hosts — required for Replit's reverse proxy.
// Metro validates both the Host and Origin headers; rewrite them both
// so requests arriving from the Replit proxy domain are accepted.
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      req.headers.host = "localhost:5000";
      req.headers.origin = "http://localhost:5000";
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
