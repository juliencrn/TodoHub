import { z } from 'zod'

// Create

export const createTaskDtoSchema = z.object({
  title: z.string(),
})
export type CreateTaskDto = z.infer<typeof createTaskDtoSchema>
