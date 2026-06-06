import { assertLogLevel, assertOneOf } from '../validate'

describe('(unit): assertOneOf', (): void => {
  test('does not throw for valid value', (): void => {
    expect((): void => assertOneOf('param', 'a', ['a', 'b'])).not.toThrow()
  })

  test('throws for invalid value', (): void => {
    expect((): void => assertOneOf('param', 'c', ['a', 'b'])).toThrow(
      'Invalid value "c" for parameter "param". Allowed values are: a, b.'
    )
  })
})

describe('(unit): assertLogLevel', (): void => {
  test.each(['silly', 'trace', 'debug', 'info', 'warning', 'error', 'fatal'])(
    'does not throw for "%s"',
    (level: string): void => {
      expect((): void => assertLogLevel(level)).not.toThrow()
    }
  )

  test('throws for invalid log level', (): void => {
    expect((): void => assertLogLevel('unknown')).toThrow()
  })
})
