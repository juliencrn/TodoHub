import type { Express } from 'express'
import request from 'supertest'

import { createServer } from './app/server'
import type { Task } from './domain/tasks/entity'
import { createTaskRepository } from './infra/task.repository'

const defaultTask = {
  id: '62ae50e3-8c35-4d23-a9d4-2d48f9a83907',
  title: 'First task',
  createdAt: new Date(2000, 0, 1), // 01/01/2000
  completed: false,
} as Task

const taskRepository = createTaskRepository([defaultTask])

describe('Test example', () => {
  let app: Express

  beforeAll(() => {
    app = createServer({ taskRepository })
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

  test('PUT /tasks/:id/complete', async () => {
    const pathname = `/tasks/${defaultTask.id}`
    const before = await request(app).get(pathname)
    expect(before.body.task.completed).toBe(false)

    await request(app)
      .put(`${pathname}/complete`)
      .send({ completed: true })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    const after = await request(app).get(pathname)
    expect(after.body.task.completed).toBe(true)
  })

  test('DELETE /tasks/:id', async () => {
    const before = await request(app).get('/tasks')
    await request(app)
      .delete(`/tasks/${defaultTask.id}`)
      .expect('content-type', /json/)
      .expect(200)

    const after = await request(app).get('/tasks')

    expect(after.body.tasks.length).toBe(before.body.tasks.length - 1)
  })
})
