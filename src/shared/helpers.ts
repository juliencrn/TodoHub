import { z } from "zod";
import * as E from "fp-ts/lib/Either";
import { fromZodError } from "zod-validation-error";

export const parseZodToEither = <T extends z.ZodObject<any>>(schema: T) => (rawInput: unknown): E.Either<string, z.infer<T>> => {
    const result = schema.safeParse(rawInput)
    return result.success ? E.right(result.data) : E.left(fromZodError(result.error).message)
}