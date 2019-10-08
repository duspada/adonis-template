'use strict';

const { isBefore, parseISO, subMinutes } = require('date-fns');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

class ResetPasswordController {
  async update({ request, response }) {
    const { token, password } = request.only(['token', 'password']);
    const userToken = await Token.findByOrFail('token', token);

    if (userToken.type !== 'forgotpassword') {
      return response.status(400).json({ error: 'Invalid token' });
    }

    if (isBefore(parseISO(userToken.created_at), subMinutes(new Date(), 120))) {
      return response.status(400).json({ error: 'Invalid token date' });
    }

    if (userToken.is_revoked) {
      return response.status(400).json({ error: 'Token revoked' });
    }

    const user = await userToken.user().fetch();

    userToken.is_revoked = true;
    await userToken.save();
    await userToken.reload();

    user.password = password;
    await user.save();
  }
}

module.exports = ResetPasswordController;
