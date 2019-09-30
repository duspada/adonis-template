'use strict';

const { isBefore, parseISO, subMinutes } = require('date-fns');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use('App/Models/Token');

class ResetPasswordController {
  async update({ request, response }) {
    const { token, password } = request.only(['token', 'password']);
    const userToken = await Token.findByOrFail('token', token);

    if (isBefore(parseISO(userToken.created_at), subMinutes(new Date(), 120))) {
      return response.status(400).json({ error: 'Invalid token' });
    }

    const user = await userToken.user().fetch();

    user.password = password;
    await user.save();
  }
}

module.exports = ResetPasswordController;
