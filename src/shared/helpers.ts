/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export const parseZodToEither =
  <T extends z.ZodObject<any>>(schema: T) =>
  (rawInput: unknown): E.Either<string, z.infer<T>> => {
    const result = schema.safeParse(rawInput)
    return result.success
      ? E.right(result.data)
      : E.left(fromZodError(result.error).message)
  }

type FailureResponse = { status: number; payload: { error: string } }
type SuccessResponse<T> = { status: number; payload: T }
type ResponseData<T> = FailureResponse | SuccessResponse<T>

export const handleTaskEitherResponse = <E, T>() =>
  TE.match<E, ResponseData<T>, T>(
    error =>
      typeof error === 'string'
        ? { status: 400, payload: { error } }
        : { status: 500, payload: { error: 'Internal server error' } },
    result => ({ status: 200, payload: result }),
  )
