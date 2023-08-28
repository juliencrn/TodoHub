import type { Brand } from 'ts-brand'
import { z } from 'zod'

import { zodSchemaToPredicate } from '~/shared/helpers'

export type TaskId = Brand<string, 'TaskId'>

// Bounded String

export type String50 = Brand<string, 'String50'>
export const string50Schema = z.string().min(1).max(50)

export const isValidString50 = (input: string): input is String50 => {
  return zodSchemaToPredicate(string50Schema)(input)
}
