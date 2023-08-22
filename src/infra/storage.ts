import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import { Task, TaskRepository } from '~/domain/tasks/types'

const storage: { tasks: Task[] } = {
  tasks: [],
}

export const taskStorage: TaskRepository = {
  get: id =>
    pipe(
      storage.tasks.find(task => task.id === id),
      TE.fromNullable('Task not found'),
    ),
  create: task => {
    storage.tasks.push(task)
    return TE.right(task)
  },
}
