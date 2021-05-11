const jwt = require('jsonwebtoken');
const env = require('../../_shared/environment');

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, env.configJwt.audience, (err, user) => {
    if (err) return res.status(403).json({ message: err.message });

    req.user = user;
    next();
  });
}

module.exports = checkToken;
