import { RequestHandler } from 'express'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import { createTask } from '~/domain/tasks/createTask'
import { createTaskDtoSchema } from '~/domain/tasks/types'
import { taskStorage } from '~/infra/storage'
import { parseZodToEither } from '~/shared/helpers'

export const createTaskController: RequestHandler = async (req, res) => {
  const workflow = pipe(
    req.body,
    parseZodToEither(createTaskDtoSchema),
    TE.fromEither,
    TE.chain(createTask(taskStorage)),
  )

  const match = TE.match(
    error =>
      typeof error === 'string'
        ? { status: 400, payload: { error } }
        : { status: 500, payload: { error: 'Internal server error' } },
    result => ({ status: 200, payload: result }),
  )

  const response = await match(workflow)()

  res.status(response.status).json(response.payload)
}
