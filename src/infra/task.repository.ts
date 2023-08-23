import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import type {
  Task,
  TaskRepository as ITaskRepository,
} from '~/domain/tasks/types'

/**
 * ES6 Classes with mutable properties aren't functional programming,
 * But this repository is out of both the `app` and `domain` and
 * it's a standalone dependency used as temporary in-memory storage.
 */
export class TaskRepository implements ITaskRepository {
  private tasks: Task[] = []

  constructor(initialTasks: Task[] = []) {
    this.tasks = initialTasks
  }

  getById = (id: string) => {
    return pipe(
      this.tasks.find(task => task.id === id),
      TE.fromNullable('Task not found'),
    )
  }

  getAll() {
    return TE.right(this.tasks)
  }

  create(task: Task) {
    const updatedTasks = [...this.tasks, task]
    return TE.rightIO(() => {
      this.tasks = updatedTasks
      return task
    })
  }
}
