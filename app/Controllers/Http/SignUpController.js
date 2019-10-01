/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class SignUpController {
  async store({ request }) {
    const { email, password, name } = request.only([
      'email',
      'password',
      'name',
    ]);

    const user = await User.create({ email, password, name });

    return user;
  }
}

module.exports = SignUpController;
