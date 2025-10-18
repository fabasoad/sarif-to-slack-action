jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  getBooleanInput: jest.fn(),
}));

import { getInput, getBooleanInput, InputOptions } from '@actions/core'
import run from '../../run'

describe('(integration): run', (): void => {
  beforeEach((): void => {
    (getInput as jest.Mock<string, [string, InputOptions]>).mockImplementation(
      (name: string, opts?: InputOptions): string => {
        switch (name) {
          case 'slack-webhook':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(true)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_WEBHOOK_URL as string
          case 'username':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_USERNAME as string
          case 'icon-url':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_ICON_URL as string
          case 'color':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR as string
          case 'color-empty':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_EMPTY as string
          case 'color-level-error':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_ERROR as string
          case 'color-level-warning':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_WARNING as string
          case 'color-level-note':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_NOTE as string
          case 'color-level-none':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_NONE as string
          case 'color-level-unknown':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_UNKNOWN as string
          case 'color-severity-critical':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_CRITICAL as string
          case 'color-severity-high':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_HIGH as string
          case 'color-severity-medium':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_MEDIUM as string
          case 'color-severity-low':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_LOW as string
          case 'color-severity-none':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_NONE as string
          case 'color-severity-unknown':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_COLOR_UNKNOWN as string
          case 'sarif-path':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(true)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_SARIF_PATH as string
          case 'sarif-file-extension':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_SARIF_FILE_EXTENSION as string
          case 'log-level':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_LOG_LEVEL as string
          case 'log-template':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(false)
            return process.env.SARIF_TO_SLACK_LOG_TEMPLATE as string
          case 'log-colored':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_LOG_COLORED as string
          case 'header':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_HEADER as string
          case 'footer':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_FOOTER as string
          case 'actor':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_ACTOR as string
          case 'representation':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_REPRESENTATION as string
          case 'send-if':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_SEND_IF as string
          default:
            fail(`Unhandled parameter "${name}"`)
        }
      }
    );
    (getBooleanInput as jest.Mock<boolean, [string, InputOptions]>).mockImplementation(
      (name: string, opts?: InputOptions): boolean => {
        switch (name) {
          case 'sarif-path-recursive':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return Boolean(process.env.SARIF_TO_SLACK_SARIF_PATH_RECURSIVE)
          case 'include-header':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_HEADER !== 'skip'
          case 'include-footer':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_FOOTER !== 'skip'
          case 'include-actor':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return process.env.SARIF_TO_SLACK_ACTOR !== 'skip'
          case 'include-run':
            expect(opts).not.toBeFalsy()
            expect(opts?.required).toBe(false)
            expect(opts?.trimWhitespace).toBe(true)
            return Boolean(process.env.SARIF_TO_SLACK_SARIF_INCLUDE_RUN)
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
    await run()
  })
})
