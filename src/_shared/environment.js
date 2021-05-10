module.exports = {
  MONGO_SETTINGS: {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 5000
  },
  port: process.env.PORT || 4000,
  sslPort: process.env.SSLPORT,
  baseApi: 'v1',
  configJwt: {
    audience: 'LareiraRossi@2021',
    issuer: process.env.IDENTITY_HOST,
    algorithms: ['RS256'],
    expiresIn: '1d'
  }
};
