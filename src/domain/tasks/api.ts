import type * as TE from 'fp-ts/TaskEither'

import type { CreateTaskDto } from './dto'
import type { Task } from './entity'
import type { TaskId } from './simpleTypes'

export type CreateTask = (dto: CreateTaskDto) => TE.TaskEither<string, Task>

export type CompleteTask = (
  id: TaskId,
  isCompleted: boolean,
) => TE.TaskEither<string, true>

export type GetTask = (id: TaskId) => TE.TaskEither<string, Task>

export type DeleteTask = (id: TaskId) => TE.TaskEither<string, true>

// TODO: Contains getFilteredTasks and getPagination
export type QueryTasks = () => TE.TaskEither<string, Task[]>
