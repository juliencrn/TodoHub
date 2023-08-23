import { createServer } from './app/server'
import { TaskRepository } from './infra/task.repository'

const taskRepository = new TaskRepository()

const app = createServer({ taskRepository })

app.listen(4000, () => {
  console.log(`server running on port 4000`)
})
