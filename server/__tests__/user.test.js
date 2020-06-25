import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../src/app';

import factory from './factory';

import truncate from './util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('A senha deve ser encriptada quando usuario for criado', async () => {
    const user = await factory.create('User', {
      password: '123123123',
    });

    const compareHash = await bcrypt.compare('123123123', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('Deve ser possivel se cadastrar', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('Não deve ser possivel criar usuário com email ja existente', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });
});
