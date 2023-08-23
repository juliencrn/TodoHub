import express from 'express'

import { TaskRepository } from '~/domain/tasks/types'

import { sayHelloController } from './hello.controller'
import {
  createTaskController,
  getAllTasksController,
  getTaskController,
} from './task.controller'

type AppDependencies = {
  taskRepository: TaskRepository
}

export const createServer = ({ taskRepository }: AppDependencies) => {
  const app = express()

  app.use(express.json())

  // Routes
  app.route('/hello').get(sayHelloController)
  app.route('/tasks/:id').get(getTaskController(taskRepository))
  app
    .route('/tasks')
    .get(getAllTasksController(taskRepository))
    .post(createTaskController(taskRepository))

  return app
}
