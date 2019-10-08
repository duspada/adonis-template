/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class SessionController {
  async store({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password']);

    const user = await User.findByOrFail('email', email);
    if (!user.active) {
      return response.status(400).json({
        error: 'Usuário inativo.',
      });
    }

    const token = await auth.attempt(email, password);

    return { token };
  }
}

module.exports = SessionController;
