function extractClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    '0.0.0.0'
  );
}

function ipMiddleware(req, res, next) {
  req.clientIP = extractClientIP(req);
  next();
}

module.exports = { ipMiddleware, extractClientIP };
