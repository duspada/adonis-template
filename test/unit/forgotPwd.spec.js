const { test, trait } = use('Test/Suite')('Forgot Pwd');

const { subMinutes, format } = require('date-fns');

const Mail = use('Mail');
const Hash = use('Hash');
const Database = use('Database');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('DatabaseTransactions');
trait('Auth/Client');

const userData = {
  email: 'a@b.com',
  password: '1234',
};

async function createUser(client) {
  const user = await Factory.model('App/Models/User').create(userData);

  await client
    .post('/forgot')
    .send(userData)
    .end();

  return user;
}

test('it should be able to send email to reset pwd', async ({
  client,
  assert,
}) => {
  Mail.fake();

  const user = await createUser(client);

  const recentEmail = Mail.pullRecent();

  assert.equal(recentEmail.message.to[0].address, userData.email);

  const token = await user.tokens().first();
  assert.include(token.toJSON(), {
    user_id: user.id,
    type: 'forgotpassword',
  });

  Mail.restore();
});

test('it should be able to reset the password', async ({ assert, client }) => {
  const user = await createUser(client);
  const { token } = await user.tokens().first();

  await client
    .put('/reset')
    .send({
      token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  await user.reload();
  const hashPassword = await Hash.verify('123456', user.password);

  assert.isTrue(hashPassword);
});

test('it should not be able to reset password after some period', async ({
  client,
}) => {
  const user = await createUser(client);
  const token = await user.tokens().first();

  await Database.table('tokens')
    .where('token', token.token)
    .update(
      'created_at',
      format(subMinutes(new Date(), 121), 'yyyy-MM-dd HH:mm:ss')
    );

  await token.reload();

  const response = await client
    .put('/reset')
    .send({
      token: token.token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  response.assertStatus(400);
});

test('it should not be able to reset password with revoked token', async ({
  client,
  assert,
}) => {
  const user = await createUser(client);
  const { token } = await user.tokens().first();

  await client
    .put('/reset')
    .send({
      token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end(); // should change normally

  await client
    .put('/reset')
    .send({
      token,
      password: '1234567',
      password_confirmation: '1234567',
    })
    .end(); // should not have changed

  await user.reload();
  const hashPassword = await Hash.verify('123456', user.password);

  assert.isTrue(hashPassword);
});

test('it should not be able to reset password with bearer token', async ({
  client,
  assert,
}) => {
  const user = await createUser(client);
  user.active = true;
  await user.save();

  const response = await client
    .post('/sessions')
    .send(userData)
    .end();

  const { token } = response.body.token;

  await client
    .put('/reset')
    .send({
      token,
      password: '123456',
      password_confirmation: '123456',
    })
    .end();

  await user.reload();
  const hashPassword = await Hash.verify('1234', user.password);

  assert.isTrue(hashPassword);
});
