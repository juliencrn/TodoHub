import express from 'express'

import type { TaskRepository } from '~/domain/tasks/repository'

import {
  completeTaskController,
  createTaskController,
  deleteTaskController,
  getAllTasksController,
  getTaskController,
} from './task/controller'

type AppDependencies = {
  taskRepository: TaskRepository
}

export const createServer = ({ taskRepository }: AppDependencies) => {
  const app = express()

  app.use(express.json())

  // Routes
  app.route('/tasks/:id/complete').put(completeTaskController(taskRepository))
  app
    .route('/tasks/:id')
    .get(getTaskController(taskRepository))
    .delete(deleteTaskController(taskRepository))
  app
    .route('/tasks')
    .get(getAllTasksController(taskRepository))
    .post(createTaskController(taskRepository))

  return app
}
