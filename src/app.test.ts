import request from 'supertest'

import { createServer } from './app/server'

describe('Test example', () => {
  const app = createServer()

  test('GET /hello', done => {
    const payload = { message: 'Hello world!' }
    request(app)
      .get('/hello')
      .expect('Content-Type', /json/)
      .expect(200, payload, done)
  })
})
