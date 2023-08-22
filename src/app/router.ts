import express from 'express';

import { createTaskController } from './controller';

const router = express.Router()

router.get('/hello', (req, res) => {
    res.send('hello world')
})

router.post('/tasks', createTaskController)

export { router }