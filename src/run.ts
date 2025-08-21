import { getBooleanInput, getInput } from '@actions/core'
import { Color, SarifToSlackClient } from '@fabasoad/sarif-to-slack'
import {
  processLogLevel,
  processRepresentationType,
  processSarifExtension,
  processSendIf
} from './processors'

export default async function run(): Promise<void> {
  const client: SarifToSlackClient = await SarifToSlackClient.create({
    webhookUrl: getInput('slack-webhook', { required: true, trimWhitespace: true }),
    username: getInput('username', { required: false, trimWhitespace: true }),
    iconUrl: getInput('icon-url', { required: false, trimWhitespace: true }),
    color: {
      default: Color.from(getInput('color', { required: false, trimWhitespace: true })),
      empty: Color.from(getInput('color-empty', { required: false, trimWhitespace: true })),
      byLevel: {
        error: Color.from(getInput('color-level-error', { required: false, trimWhitespace: true })),
        warning: Color.from(getInput('color-level-warning', { required: false, trimWhitespace: true })),
        note: Color.from(getInput('color-level-note', { required: false, trimWhitespace: true })),
        none: Color.from(getInput('color-level-none', { required: false, trimWhitespace: true })),
        unknown: Color.from(getInput('color-level-unknown', { required: false, trimWhitespace: true })),
      },
      bySeverity: {
        critical: Color.from(getInput('color-severity-critical', { required: false, trimWhitespace: true })),
        high: Color.from(getInput('color-severity-high', { required: false, trimWhitespace: true })),
        medium: Color.from(getInput('color-severity-medium', { required: false, trimWhitespace: true })),
        low: Color.from(getInput('color-severity-low', { required: false, trimWhitespace: true })),
        none: Color.from(getInput('color-severity-none', { required: false, trimWhitespace: true })),
        unknown: Color.from(getInput('color-severity-unknown', { required: false, trimWhitespace: true })),
      },
    },
    sarif: {
      path: getInput('sarif-path', { required: true, trimWhitespace: true }),
      recursive: getBooleanInput('sarif-path-recursive', { required: false, trimWhitespace: true }),
      extension: processSarifExtension(getInput('sarif-file-extension', { required: false, trimWhitespace: true })),
    },
    log: {
      level: processLogLevel(getInput('log-level', { required: false, trimWhitespace: true })),
      template: getInput('log-template', { required: false, trimWhitespace: false }),
      colored: getBooleanInput('log-colored', { required: false, trimWhitespace: true }),
    },
    header: {
      include: getBooleanInput('include-header', { required: false, trimWhitespace: true }),
      value: getInput('header', { required: false, trimWhitespace: true })
    },
    footer: {
      include: getBooleanInput('include-footer', { required: false, trimWhitespace: true }),
      value: getInput('footer', { required: false, trimWhitespace: true })
    },
    actor: {
      include: getBooleanInput('include-actor', { required: false, trimWhitespace: true }),
      value: getInput('actor', { required: false, trimWhitespace: true })
    },
    run: {
      include: getBooleanInput('include-run', { required: false, trimWhitespace: true }),
    },
    representation: processRepresentationType(getInput('representation', { required: false, trimWhitespace: true })),
    sendIf: processSendIf(getInput('send-if', { required: false, trimWhitespace: true })),
  })
  await client.send()
}
