import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { make } from 'ts-brand'
import { v4 as uuid } from 'uuid'

import type { CreateTaskDto } from './dto'
import type { String50, TaskId } from './simpleTypes'
import { isValidString50 } from './simpleTypes'

export type Task = Readonly<{
  id: TaskId
  title: String50
  completed: boolean
  createdAt: Date
}>

export class TaskBuilder {
  private constructor() {}

  static createFromDto(dto: CreateTaskDto): E.Either<string, Task> {
    return pipe(
      dto.title,
      E.fromPredicate(isValidString50, () => 'title is too long, 50 chars max'),
      E.chain(title =>
        E.of({
          id: make<TaskId>()(uuid()),
          createdAt: new Date(),
          completed: false,
          title,
        } satisfies Task),
      ),
    )
  }
}
