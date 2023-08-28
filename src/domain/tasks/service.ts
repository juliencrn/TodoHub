import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import type * as Api from './api'
import { TaskBuilder } from './entity'
import type { TaskRepository } from './repository'

export const createTaskService =
  (taskRepository: TaskRepository): Api.CreateTask =>
  dto =>
    pipe(
      TaskBuilder.createFromDto(dto),
      TE.fromEither,
      TE.chain(task => taskRepository.create(task)),
    )

export const getTaskService = (taskRepository: TaskRepository): Api.GetTask =>
  taskRepository.findById

// TODO: Impl filters (getFilteredTasks)
// TODO: Impl pagination (getPagination)
export const queryTasksService = (
  taskRepository: TaskRepository,
): Api.QueryTasks => taskRepository.findAll

export const completeTaskService =
  (taskRepository: TaskRepository): Api.CompleteTask =>
  (id, completed) =>
    taskRepository.update(id, { completed })

export const deleteTaskService = (
  taskRepository: TaskRepository,
): Api.DeleteTask => taskRepository.remove
