import { createServer } from './app/server'

const app = createServer()

app.listen(4000, () => {
  console.log(`server running on port 4000`)
})
