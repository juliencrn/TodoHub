import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import type { SafeParseReturnType, z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export const zodSchemaToPredicate =
  <I>(schema: z.ZodType) =>
  (input: I): boolean =>
    schema.safeParse(input).success

const zodResultToEither = <I, O>(
  zodResult: SafeParseReturnType<I, O>,
): E.Either<string, O> => {
  return zodResult.success
    ? E.right(zodResult.data)
    : E.left(fromZodError(zodResult.error).message)
}

export const parseZodToEither =
  <T extends z.ZodType>(schema: T) =>
  (rawInput: unknown): E.Either<string, z.infer<T>> => {
    return pipe(rawInput, schema.safeParse, zodResultToEither)
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
