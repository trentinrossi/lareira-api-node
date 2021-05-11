const { onError, onSuccess, onLogin } = require('../../_shared/handlers/request-handler');
const { User } = require('./login.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const env = require('../../_shared/environment');

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }, {}, {});
    if (!user) return onError('User or password not found', {}, res);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return onError('User or password not found', {}, res);

    const token = jwt.sign({ username, password }, env.configJwt.audience, { expiresIn: env.configJwt.expiresIn });
    onLogin(token, res);
  } catch (e) {
    onError('Error trying to login user', e.toString(), res);
  }
}

async function logout(req, res) {
  // Implementar uma forma de guardar o token no Redis
  onError(`Not implemented yet`, ``, res);
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

    const token = jwt.sign(username, env.configJwt.audience, { expiresIn: env.configJwt.expiresIn });
    onSuccess({}, token, res);
  } catch (e) {
    onError('Error trying to create user', e.toString(), res);
  }
}

module.exports = { login, signup, logout };
