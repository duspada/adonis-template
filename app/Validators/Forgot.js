const Antl = use('Antl');

class Forgot {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      email: 'email|required|exists:users,email',
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = Forgot;
