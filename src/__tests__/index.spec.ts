import { vi } from 'vitest'

const mockRun = vi.hoisted(() => vi.fn<() => Promise<void>>().mockResolvedValue(undefined))

vi.mock('../run', () => ({ default: mockRun }))

describe('(unit): index', (): void => {
  test('calls run on import', async (): Promise<void> => {
    await import('../index')
    expect(mockRun).toHaveBeenCalledTimes(1)
  })
})
