import { RequestHandler } from 'express'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { z } from 'zod'

import { createTaskService } from '~/domain/tasks/task.service'
import { createTaskDtoSchema, TaskRepository } from '~/domain/tasks/types'
import { handleTaskEitherResponse, parseZodToEither } from '~/shared/helpers'

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
    const idSchema = z.object({
      id: z.string(),
    })
    const parsed = parseZodToEither(idSchema)(req.params)
    const response = await pipe(
      parsed,
      E.chain(parsed => E.of(parsed.id)),
      TE.fromEither,
      TE.chain(taskRepository.getById),
      TE.chain(task => TE.of({ task })),
      handleTaskEitherResponse(),
    )()

    res.status(response.status).json(response.payload)
  }

export const getAllTasksController =
  (taskRepository: TaskRepository): RequestHandler =>
  async (_req, res) => {
    const response = await pipe(
      taskRepository.getAll(),
      TE.chain(tasks => TE.of({ tasks })),
      handleTaskEitherResponse(),
    )()

    res.status(response.status).json(response.payload)
  }
