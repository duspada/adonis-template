class SignUp {
  get rules() {
    return {
      email: 'email|required',
      password: 'required|confirmed',
    };
  }
}

module.exports = SignUp;
