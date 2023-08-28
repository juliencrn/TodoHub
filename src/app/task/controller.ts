import type { RequestHandler } from 'express'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { make } from 'ts-brand'
import { z } from 'zod'

import { createTaskDtoSchema } from '~/domain/tasks/dto'
import type { TaskRepository } from '~/domain/tasks/repository'
import {
  completeTaskService,
  createTaskService,
  deleteTaskService,
  getTaskService,
  queryTasksService,
} from '~/domain/tasks/service'
import type { TaskId } from '~/domain/tasks/simpleTypes'
import { handleTaskEitherResponse, parseZodToEither } from '~/shared/helpers'

const idSchema = z.object({
  id: z.string(),
})

export const createTaskController =
  (taskRepository: TaskRepository): RequestHandler =>
  async (req, res) => {
    const parsedBody = parseZodToEither(createTaskDtoSchema)(req.body)
    const response = await pipe(
      parsedBody,
      TE.fromEither,
      TE.chain(createTaskService(taskRepository)),
      TE.chain(task => TE.of({ task })),
      handleTaskEitherResponse(),
    )()

    res.status(response.status).json(response.payload)
  }

export const getTaskController =
  (taskRepository: TaskRepository): RequestHandler =>
  async (req, res) => {
    const parsed = parseZodToEither(idSchema)(req.params)
    const response = await pipe(
      parsed,
      E.chain(parsed => E.of(make<TaskId>()(parsed.id))),
      TE.fromEither,
      TE.chain(getTaskService(taskRepository)),
      TE.chain(task => TE.of({ task })),
      handleTaskEitherResponse(),
    )()

    res.status(response.status).json(response.payload)
  }

export const getAllTasksController =
  (taskRepository: TaskRepository): RequestHandler =>
  async (_req, res) => {
    const response = await pipe(
      queryTasksService(taskRepository)(),
      TE.chain(tasks => TE.of({ tasks })),
      handleTaskEitherResponse(),
    )()

    res.status(response.status).json(response.payload)
  }

export const completeTaskController =
  (taskRepository: TaskRepository): RequestHandler =>
  async (req, res) => {
    const isCompletedSchema = z.object({
      completed: z.boolean(),
    })
    const parsedParams = parseZodToEither(idSchema)(req.params)
    const parsedBody = parseZodToEither(isCompletedSchema)(req.body)

    const response = await pipe(
      parsedParams,
      E.chain(parsed => E.of(make<TaskId>()(parsed.id))),
      E.chain(taskId =>
        pipe(
          parsedBody,
          E.chain(change => E.of({ taskId, change })),
        ),
      ),
      TE.fromEither,
      TE.chain(({ taskId, change }) =>
        completeTaskService(taskRepository)(taskId, change.completed),
      ),
      TE.chain(task => TE.of({ task })),
      handleTaskEitherResponse(),
    )()
    res.status(response.status).json(response.payload)
  }

export const deleteTaskController =
  (taskRepository: TaskRepository): RequestHandler =>
  async (req, res) => {
    const parsedParams = parseZodToEither(idSchema)(req.params)
    const response = await pipe(
      parsedParams,
      E.chain(parsed => E.of(make<TaskId>()(parsed.id))),
      TE.fromEither,
      TE.chain(deleteTaskService(taskRepository)),
      TE.chain(success => TE.of({ success })),
      handleTaskEitherResponse(),
    )()
    res.status(response.status).json(response.payload)
  }
