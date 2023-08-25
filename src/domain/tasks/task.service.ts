import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { parseZodToEither } from '~/shared/helpers'

import {
  CreateTask,
  CreateTaskDto,
  GetTask,
  QueryTasks,
  String50,
  Task,
  TaskId,
  TaskRepository,
} from './types'

type ValidatedCreateDto = { title: String50 }

const validateCreateTaskDto = (dto: CreateTaskDto) => {
  return pipe(
    dto,
    parseZodToEither(z.object({ title: z.string() })),
    E.map(dto => dto as ValidatedCreateDto),
  )
}

const createNewTask = (dto: ValidatedCreateDto): Task => ({
  id: uuid() as TaskId,
  title: dto.title,
  createdAt: new Date(),
  completed: false,
})

export const createTaskService =
  (taskRepository: TaskRepository): CreateTask =>
  dto => {
    return pipe(
      dto,
      validateCreateTaskDto,
      E.map(createNewTask),
      TE.fromEither,
      TE.chain(task => taskRepository.create(task)),
    )
  }

export const getTaskService = (taskRepository: TaskRepository): GetTask =>
  taskRepository.getById

// TODO: Impl filters (getFilteredTasks)
// TODO: Impl pagination (getPagination)
export const queryTasksService = (taskRepository: TaskRepository): QueryTasks =>
  taskRepository.getAll
