const { createTerminus } = require('@godaddy/terminus');

const healtcheck = (httpServer) => {
  createTerminus(httpServer, {
    signal: 'SIGINT',
    healthChecks: {
      '/healthcheck': async () => {},
      '/': async () => {},
    },
    onSignal: async () => {},
  });
};

module.exports = healtcheck;
