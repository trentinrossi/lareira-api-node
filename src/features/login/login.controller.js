const { onError, onSuccess, onCreated, onBadRequest, onNoContent, onUpdated } = require('../../_shared/handlers/request-handler');
const { User } = require('./login.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const env = require('../../_shared/environment');

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }, {}, {});
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid || !user) return onError('User or password not found', {}, res);

    const token = jwt.sign({ username, password }, env.configJwt.audience, {});
    onSuccess({}, token, res);
  } catch (e) {
    onError('Error trying to create user', e.toString(), res);
  }
}

async function signup(req, res) {
  const { name, username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    await User.create({
      name,
      username,
      email,
      password: hash
    });

    const token = jwt.sign(username, env.configJwt.audience, {});
    onSuccess({}, token, res);
  } catch (e) {
    onError('Error trying to create user', e.toString(), res);
  }
}
function logout(req, res) {}

module.exports = { login, signup };
