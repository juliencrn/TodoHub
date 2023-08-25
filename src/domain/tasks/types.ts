import * as TE from 'fp-ts/lib/TaskEither'
import { Brand } from 'ts-brand'
import { z } from 'zod'

// Simple types

export type TaskId = Brand<string, 'TaskId'>
export type String50 = Brand<string, 'String50'>
export const string50Schema = z.string().min(1).max(50)

// Composed types

export type Task = {
  readonly id: TaskId
  readonly title: String50
  readonly completed: boolean
  readonly createdAt: Date
}

// State types

export const createTaskDtoSchema = z.object({
  title: z.string(),
})
export type CreateTaskDto = z.infer<typeof createTaskDtoSchema>

export type UpdateTaskDto = z.infer<typeof updateTaskDtoSchema>
export const updateTaskDtoSchema = z.object({
  title: z.string(),
  completed: z.boolean().optional(),
})

// Domain API

export type CreateTask = (dto: CreateTaskDto) => TE.TaskEither<string, Task>
export type UpdateTask = (
  // TODO: use TaskId instead of `string` or not?
  id: string,
  change: Partial<UpdateTaskDto>,
) => TE.TaskEither<string, Task>
// TODO: use TaskId instead of `string` or not?
export type GetTask = (id: string) => TE.TaskEither<string, Task>
// TODO: use TaskId instead of `string` or not?
export type DeleteTask = (id: string) => TE.TaskEither<string, true>

// TODO: Contains getFilteredTasks and getPagination
export type QueryTasks = () => TE.TaskEither<string, Task[]>

// Repository needed

export type TaskRepository = {
  // TODO: use TaskId instead of `string` or not?
  getById: (id: string) => TE.TaskEither<string, Task>
  getAll: () => TE.TaskEither<string, Task[]>
  create: (task: Task) => TE.TaskEither<string, Task>
}
