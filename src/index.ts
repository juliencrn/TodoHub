import { createServer } from './app/server'
import { createTaskRepository } from './infra/task.repository'

const taskRepository = createTaskRepository()

const app = createServer({ taskRepository })

app.listen(4000, () => {
  console.log(`server running on port 4000`)
})
