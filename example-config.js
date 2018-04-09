module.exports = {
  server: {
    port: 8080,
    host: '127.0.0.1'
  },
  db: 'db connection string',
  jwtSecret: 'secret',
  jwtOptions: {
    expiresIn: '7d'
  },
  env: {
    isTest: false
  }
};