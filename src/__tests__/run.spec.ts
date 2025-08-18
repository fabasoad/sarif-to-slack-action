const mockGetInput: jest.Mock<string, [string, InputOptions]> = jest.fn()
const mockGetBooleanInput: jest.Mock<boolean, [string, InputOptions]> = jest.fn()

jest.mock('@actions/core', () => ({
  ...jest.requireActual('@actions/core'),
  getInput: mockGetInput,
  getBooleanInput: mockGetBooleanInput,
}))

jest.mock('@fabasoad/sarif-to-slack', () => ({
  ...jest.requireActual('@fabasoad/sarif-to-slack'),
  Color: jest.fn().mockImplementation((color: string) => ({
    value: color,
  })),
}))

import { InputOptions } from '@actions/core'
import {
  LogLevel, RepresentationType,
  SarifToSlackClient,
  SarifToSlackClientOptions, SendIf
} from '@fabasoad/sarif-to-slack'
import run from '../run'

describe('(unit): run', (): void => {
  beforeEach((): void => {
    mockGetInput.mockImplementation(
      (name: string, opts?: InputOptions): string => {
        const map = new Map<string, string>([
          ['sarif-file-extension', 'sarif'],
          ['log-level', 'warning'],
          ['representation', 'compact-group-by-tool-name-per-severity'],
          ['send-if', 'severity-high-or-higher']
        ])
        expect(opts).not.toBeFalsy()
        expect(opts?.required).toBe(['slack-webhook', 'sarif-path'].includes(name))
        expect(opts?.trimWhitespace).toBe(name !== 'log-template')
        return map.get(name) ?? `${name}-test`
      }
    );
    mockGetBooleanInput.mockImplementation(
      (name: string, opts?: InputOptions): boolean => {
        switch (name) {
          case 'sarif-path-recursive':
          case 'log-colored':
          case 'include-header':
          case 'include-footer':
          case 'include-actor':
          case 'include-run':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return true
          default:
            fail(`Unhandled parameter "${name}"`)
        }
      }
    )
  })

  afterEach((): void => {
    jest.clearAllMocks()
  })

  test('should send Sarif to Slack', async (): Promise<void> => {
    const mockSend: jest.Mock<Promise<void>, []> = jest.fn()
    const mockCreate: jest.SpyInstance<Promise<SarifToSlackClient>, [SarifToSlackClientOptions]> = jest
      .spyOn(SarifToSlackClient, 'create')
      .mockImplementation((opts: SarifToSlackClientOptions): Promise<SarifToSlackClient> => {
        expect(opts.webhookUrl).toBe('slack-webhook-test')
        expect(opts.username).toBe('username-test')
        expect(opts.iconUrl).toBe('icon-url-test')
        expect(opts.color?.default?.value).toBe('color-test')
        expect(opts.color?.empty?.value).toBe('color-empty-test')
        expect(opts.color?.byLevel?.error?.value).toBe('color-level-error-test')
        expect(opts.color?.byLevel?.warning?.value).toBe('color-level-warning-test')
        expect(opts.color?.byLevel?.note?.value).toBe('color-level-note-test')
        expect(opts.color?.byLevel?.none?.value).toBe('color-level-none-test')
        expect(opts.color?.byLevel?.unknown?.value).toBe('color-level-unknown-test')
        expect(opts.color?.bySeverity?.critical?.value).toBe('color-severity-critical-test')
        expect(opts.color?.bySeverity?.high?.value).toBe('color-severity-high-test')
        expect(opts.color?.bySeverity?.medium?.value).toBe('color-severity-medium-test')
        expect(opts.color?.bySeverity?.low?.value).toBe('color-severity-low-test')
        expect(opts.color?.bySeverity?.none?.value).toBe('color-severity-none-test')
        expect(opts.color?.bySeverity?.unknown?.value).toBe('color-severity-unknown-test')
        expect(opts.sarif.path).toBe('sarif-path-test')
        expect(opts.sarif.recursive).toBe(true)
        expect(opts.sarif.extension).toBe('sarif')
        expect(opts.log?.level).toBe(LogLevel.Warning)
        expect(opts.log?.template).toBe('log-template-test')
        expect(opts.log?.colored).toBe(true)
        expect(opts.header?.include).toBe(true)
        expect(opts.header?.value).toBe('header-test')
        expect(opts.footer?.include).toBe(true)
        expect(opts.footer?.value).toBe('footer-test')
        expect(opts.actor?.include).toBe(true)
        expect(opts.actor?.value).toBe('actor-test')
        expect(opts.run?.include).toBe(true)
        expect(opts.representation).toBe(RepresentationType.CompactGroupByToolNamePerSeverity)
        expect(opts.sendIf).toBe(SendIf.SeverityHighOrHigher)
        return Promise.resolve({
          send: mockSend
        } as unknown as SarifToSlackClient)
      })
    await run()
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledTimes(1)
  })
})
