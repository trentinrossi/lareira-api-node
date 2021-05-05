const glob = require('glob');
const env = require('../../_shared/environment');

module.exports = function routerLoader(app) {
  glob(`${__dirname}`.replace(/_shared.*/g, 'features/*'), (err, featuresFolder) => {    
    if (err) { throw err; }

    featuresFolder.forEach((featureFolder) => {      
      
      glob(`${featureFolder}/*.route.js`, (error, routerFiles) => {
        if (error) { throw error; }

        routerFiles.forEach((routeFile) => {
          if (routeFile.includes('.public.')) {
            return;
          }
          const route = require(routeFile);          
          app.use(`/${env.baseApi}`, route);
        });
      });
    });
  });
};
