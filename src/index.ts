import { getInput } from '@actions/core'
import { IncomingWebhook } from '@slack/webhook'
import {
  IncomingWebhookDefaultArguments
} from '@slack/webhook/dist/IncomingWebhook'
import type { Log, Result } from 'sarif'
import { promises as fs } from 'fs'

function composeRunSummary(toolName: string, map: Map<string, number>): string {
  const levelsText: string[] = []
  for (const [level, count] of map.entries()) {
    const levelCapitalized = level.charAt(0).toUpperCase() + level.slice(1)
    levelsText.push(`*${levelCapitalized}*: ${count}`)
  }
  return `*${toolName}*\n${levelsText.join(',')}`
}

function composeSummary(sarif: Log): string {
  const data = new Map<string, Map<string, number>>()
  for (const run of sarif.runs) {
    const toolName = run.tool.driver.name
    if (!data.has(toolName)) {
      data.set(toolName, new Map<string, number>())
    }
    const results: Result[] = run.results ?? []
    for (const result of results) {
      const level = result.level ?? 'unknown'
      const count: number = data.get(toolName)?.get(level) || 0
      data.get(toolName)?.set(level, count + 1)
    }
  }
  const summaries: string[] = []
  for (const [toolName, map] of data.entries()) {
    summaries.push(composeRunSummary(toolName, map))
  }
  return summaries.join('\n')
}

async function run() {
  const webhookUrl: string = getInput('slack-webhook', { required: true })
  const sarifPath: string = getInput('sarif-path', { required: true })
  const color: string = getInput('color', { required: false })
  const icon: string = getInput('icon', { required: false })

  const jsonString = await fs.readFile(sarifPath, 'utf8')
  const sarif = JSON.parse(jsonString) as Log
  console.log('Length:', sarif.runs.length)

  const webhookOptions: IncomingWebhookDefaultArguments = {
    username: 'Application Security'
  }
  if (icon) {
    webhookOptions.icon_url = icon
  }
  const webhook = new IncomingWebhook(webhookUrl, webhookOptions)

  const runUrl = 'runUrl'//`${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  const runId = 'runId'//`#${process.env.GITHUB_RUN_ID}`
  const summary = 'summary'//composeSummary(sarif)

  const { text } = await webhook.send({
    attachments: [
      {
        color: color,
        author_name: process.env.GITHUB_ACTOR,
        author_subname: process.env.GITHUB_REPOSITORY,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${summary}\nJob <${runUrl}|${runId}>`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'plain_text',
                text: 'Production Infrastructure Security team - @prodsec',
              }
            ],
          },
        ]
      },
    ]
  })
  console.log('Message sent:', text)
}

run()
