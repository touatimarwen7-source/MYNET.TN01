// API Versioning configuration
const API_VERSION = '1.0.0';
const API_BUILD_DATE = new Date().toISOString();

const versionMiddleware = (req, res, next) => {
  res.setHeader('X-API-Version', API_VERSION);
  res.setHeader('X-Build-Date', API_BUILD_DATE);
  next();
};

module.exports = {
  API_VERSION,
  API_BUILD_DATE,
  versionMiddleware,
};
