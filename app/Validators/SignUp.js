const Antl = use('Antl');

class SignUp {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      email: 'email|required',
      password: 'required|confirmed',
    };
  }

  get messages() {
    return Antl.list('validation');
  }
}

module.exports = SignUp;
