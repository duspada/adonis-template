const { test, trait } = use('Test/Suite')('Sign Up');

trait('Test/ApiClient');
trait('DatabaseTransactions');

const userData = {
  name: 'teste',
  email: 'a@b.com',
  password: '123456',
  password_confirmation: '123456',
};

test('it should be able to create an user account', async ({
  client,
  assert,
}) => {
  const response = await client
    .post('/signup')
    .send(userData)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.email, userData.email);
});

test('it should not be able to create an user account with wrong pwd confirmation', async ({
  client,
}) => {
  const response = await client
    .post('/signup')
    .send({ ...userData, password_confirmation: '123' })
    .end();

  response.assertStatus(400);
});

test('it should not be able to create an user account with a fake email', async ({
  client,
}) => {
  const response = await client
    .post('/signup')
    .send({ ...userData, email: 'a@b.c' })
    .end();

  response.assertStatus(400);
});
