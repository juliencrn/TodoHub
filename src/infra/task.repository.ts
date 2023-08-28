import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import type { Task } from '~/domain/tasks/entity'
import type { TaskRepository } from '~/domain/tasks/repository'

export const createTaskRepository = (
  initialTasks: Task[] = [],
): TaskRepository => {
  let tasks: Task[] = initialTasks

  const create: TaskRepository['create'] = task => {
    const updatedTasks = [...tasks, task]
    return TE.rightIO(() => {
      tasks = updatedTasks
      return task
    })
  }

  const update: TaskRepository['update'] = (id, change) => {
    const index = tasks.findIndex(task => task.id === id)

    if (index === -1) {
      return TE.left('Task not found')
    }

    const updatedTask = {
      ...tasks[index],
      ...change,
    }

    const updatedTasks = [...tasks]
    updatedTasks[index] = updatedTask

    tasks = updatedTasks

    return TE.right(true)
  }

  const findById: TaskRepository['findById'] = id => {
    return pipe(
      tasks.find(task => task.id === id),
      TE.fromNullable('Task not found'),
    )
  }

  const findAll: TaskRepository['findAll'] = () => {
    return TE.right(tasks)
  }

  const remove: TaskRepository['remove'] = id => {
    const updatedList = tasks.filter(task => task.id !== id)

    if (updatedList.length === tasks.length) {
      return TE.left('Task not found')
    }

    tasks = updatedList
    return TE.right(true)
  }

  return {
    findById,
    findAll,
    create,
    update,
    remove,
    query: _predicate => TE.left('unimplemented'),
  }
}
