import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { RequestHandler } from "express";
import { pipe } from "fp-ts/lib/function";

import { createTaskDtoSchema } from "../domain/tasks/types";
import { createTask } from "../domain/tasks/createTask";
import { taskStorage } from "../infra/storage";
import { parseZodToEither } from "../shared/helpers";

export const createTaskController: RequestHandler = async (req, res) => {
    const workflow = pipe(
        req.body,
        parseZodToEither(createTaskDtoSchema),
        TE.fromEither,
        TE.chain(createTask(taskStorage))
    )

    const result = await workflow()

    // TODO: Can be improve, not so functional
    if (E.isLeft(result)) {
        if (typeof result.left === 'string') {
            res.status(400).json({ error: result.left });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(200).json(result.right);
    }
}