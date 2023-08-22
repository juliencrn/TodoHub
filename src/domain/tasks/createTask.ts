import { pipe } from "fp-ts/lib/function";
import { CreateTask, CreateTaskDto, String50, Task, TaskId, TaskRepository } from "./types"
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { z } from "zod";
import { parseZodToEither } from "../../shared/helpers";
import { v4 as uuid } from "uuid";

type ValidatedCreateDto = { title: String50 }

const validateCreateTaskDto = (dto: CreateTaskDto) => {
    return pipe(
        dto,
        parseZodToEither(z.object({ title: z.string() })),
        E.map(dto => dto as ValidatedCreateDto),
    )
}

const createNewTask = (dto: ValidatedCreateDto): Task => {
    const newTask: Task = {
        id: uuid() as TaskId,
        title: dto.title,
        createdAt: new Date(),
        completed: false,
    }
    return newTask
}

export const createTask = (storage: TaskRepository): CreateTask => dto => {
    return pipe(
        dto,
        validateCreateTaskDto,
        E.map(createNewTask),
        TE.fromEither,
        TE.chain(task => storage.create(task))
    )
}
