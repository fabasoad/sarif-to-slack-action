const mockSendAll = jest.fn().mockImplementation(() => Promise.resolve())
const mockCreate = jest.fn()

import {
  LogLevel,
  SarifToSlackService,
  SarifToSlackServiceOptions
} from '@fabasoad/sarif-to-slack'
import { jest } from '@jest/globals'
import { run } from '../index'

jest.mock('@actions/core', () => ({
  getInput: (name: string) => name === 'log-level' ? 'debug' : `mocked-${name}`,
  getBooleanInput: () => true,
}))

jest.mock('@fabasoad/sarif-to-slack', () => ({
  SarifToSlackService: {
    create: (opts: SarifToSlackServiceOptions): Promise<SarifToSlackService> => {
      mockCreate(opts)
      // @ts-ignore
      return Promise.resolve<SarifToSlackService>({
        sendAll: () => mockSendAll(),
        slackMessages: new Map<string, any>(),
        send: jest.fn()
      })
    }
  }
}))

describe('run', () => {
  beforeEach(() => jest.resetAllMocks())

  test('should call SarifToSlackService.create with correct params and sendAll', async () => {
    // Import the run function dynamically to use the mocks
    await run()
    expect(mockCreate).toHaveBeenCalledWith({
      webhookUrl: 'mocked-slack-webhook',
      username: 'mocked-username',
      iconUrl: 'mocked-icon-url',
      color: 'mocked-color',
      sarifPath: 'mocked-sarif-path',
      log: {
        level: LogLevel.Debug,
        colored: false,
      },
      header: {
        include: true,
        value: 'mocked-header'
      },
      footer: {
        include: true,
        value: 'mocked-footer'
      },
      actor: {
        include: true,
        value: 'mocked-actor'
      },
      run: {
        include: true
      }
    })
    expect(mockSendAll).toHaveBeenCalled()
  })
})
