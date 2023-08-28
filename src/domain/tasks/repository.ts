import type * as TE from 'fp-ts/lib/TaskEither'

import type { Task } from './entity'

type Entity<T = unknown> = T & { id: string }

export type Repository<T extends Entity, Id = T['id']> = {
  findById: (id: Id) => TE.TaskEither<string, T>
  findAll: () => TE.TaskEither<string, T[]>
  create: (item: T) => TE.TaskEither<string, T>
  update: (id: Id, item: Partial<T>) => TE.TaskEither<string, true>
  remove: (id: Id) => TE.TaskEither<string, true>
}

export type QueryableRepository<T extends Entity> = Repository<T> & {
  query(predicate: (item: T) => boolean): TE.TaskEither<string, T[]>
}

//

export type TaskRepository = QueryableRepository<Task>
