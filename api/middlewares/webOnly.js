const WEB_ORIGINS = new Set([
  'http://localhost:3000',
  'https://velointl.com',
  'https://www.velointl.com',
]);

export const webOnly = (req, res, next) => {
  const origin = req.get('origin');
  if (!origin || !WEB_ORIGINS.has(origin)) {
    return res.status(403).json({ message: 'This endpoint is only available on the website' });
  }
  next();
};
