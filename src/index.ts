import { getBooleanInput, getInput } from '@actions/core'
import { SarifToSlackService } from '@fabasoad/sarif-to-slack'
import {
  processCalculateResultsBy,
  processGroupResultsBy,
  processLogLevel
} from './Processors'

export async function run() {
  const sarifToSlackService: SarifToSlackService = await SarifToSlackService.create({
    webhookUrl: getInput('slack-webhook', { required: true, trimWhitespace: true }),
    username: getInput('username', { required: false, trimWhitespace: true }),
    iconUrl: getInput('icon-url', { required: false, trimWhitespace: true }),
    color: getInput('color', { required: false, trimWhitespace: true }),
    sarifPath: getInput('sarif-path', { required: true, trimWhitespace: true }),
    log: {
      level: processLogLevel(getInput('log-level', { required: false, trimWhitespace: true })),
      template: getInput('log-template', { required: false, trimWhitespace: false }),
      colored: false,
    },
    header: {
      include: getBooleanInput('include-header', { required: false }),
      value: getInput('header', { required: false, trimWhitespace: true })
    },
    footer: {
      include: getBooleanInput('include-footer', { required: false }),
      value: getInput('footer', { required: false, trimWhitespace: true })
    },
    actor: {
      include: getBooleanInput('include-actor', { required: false }),
      value: getInput('actor', { required: false, trimWhitespace: true })
    },
    run: {
      include: getBooleanInput('include-run', { required: false })
    },
    output: {
      groupBy: processGroupResultsBy(getInput('group-by', { required: false, trimWhitespace: true })),
      calculateBy: processCalculateResultsBy(getInput('calculate-by', { required: false, trimWhitespace: true })),
    }
  })
  await sarifToSlackService.sendAll()
}

run()
