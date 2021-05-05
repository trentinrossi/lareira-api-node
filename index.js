const result = require('dotenv').config();

const app = require('./src/_shared/utils/App');

(async () => {
  try {
    await app.init();
  } catch (err) {
    console.log('INIT', err);
    process.exit(1);
  }
})();
