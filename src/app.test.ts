import type { Express } from 'express'
import request from 'supertest'

import { createServer } from './app/server'
import { Task } from './domain/tasks/types'
import { TaskRepository } from './infra/task.repository'

describe('Test example', () => {
  const defaultTask = {
    id: '62ae50e3-8c35-4d23-a9d4-2d48f9a83907',
    title: 'First task',
    createdAt: new Date(2000, 0, 1), // 01/01/2000
    completed: false,
  } as Task

  let app: Express

  beforeAll(() => {
    const taskRepository = new TaskRepository([defaultTask])
    app = createServer({ taskRepository })
  })

  test('GET /hello', () => {
    const payload = { message: 'Hello world!' }
    return request(app)
      .get('/hello')
      .expect('content-type', /json/)
      .expect(200, payload)
  })

  test('GET /tasks/:id', async () => {
    const res = await request(app)
      .get(`/tasks/${defaultTask.id}`)
      .expect('content-type', /json/)
      .expect(200)
    const task = res.body.task

    expect(task.id).toEqual(defaultTask.id)
    expect(task.completed).toEqual(defaultTask.completed)
    expect(task.title).toEqual(defaultTask.title)
    expect(task.createdAt).toEqual(defaultTask.createdAt.toISOString())
  })

  test('GET /tasks', async () => {
    const res = await request(app)
      .get(`/tasks`)
      .expect('content-type', /json/)
      .expect(200)

    expect(res.body.tasks.length).toBe(1)
  })

  test('POST /tasks', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'new todo' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.body.task.title).toBe('new todo')
  })
})
