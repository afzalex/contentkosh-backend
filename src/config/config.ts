export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  server: {
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
  }
};
