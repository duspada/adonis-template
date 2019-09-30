const { test, trait } = use('Test/Suite')('Session');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should be able to login', async ({ client, assert }) => {
  const userData = {
    name: 'teste',
    email: 'a@b.c',
    password: '123456',
  };

  await Factory.model('App/Models/User').create(userData);

  const response = await client
    .post('/sessions')
    .send(userData)
    .end();

  response.assertStatus(200);
  assert.exists(response.body.token);
});
