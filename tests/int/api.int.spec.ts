// @vitest-environment node
// Minimal smoke-test: Payload local API initialises and can query the DB.
import 'dotenv/config'
import { describe, it, beforeAll, expect } from 'vitest'
import { getPayload, type Payload } from 'payload'
import config from '../../src/payload.config'

let payload: Payload

describe('API (local Payload smoke)', () => {
  beforeAll(async () => {
    payload = await getPayload({ config })
  }, 60000)

  it('payload initialises without error', () => {
    expect(payload).toBeDefined()
  })

  it('collections are reachable', async () => {
    const result = await payload.find({ collection: 'prices', limit: 1 })
    expect(result).toBeDefined()
    expect(Array.isArray(result.docs)).toBe(true)
  })
})
