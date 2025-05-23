import { AnyBlock } from '@slack/types'
import { HeaderBlock, ContextBlock } from '@slack/types/dist/block-kit/blocks'
import { IncomingWebhook } from '@slack/webhook'
import type { Log, Run, Result, ReportingDescriptor } from 'sarif'

export type SlackMessageBuilderOptions = {
  username?: string
  iconUrl?: string
  color?: string
  sarif: Log
}

type RuleData = { id?: string, index?: number }

export class SlackMessageBuilder {
  private readonly webhook: IncomingWebhook
  private readonly gitHubServerUrl: string
  private readonly sarif: Log
  private readonly color?: string

  private header?: HeaderBlock
  private footer?: ContextBlock
  private actor?: string
  private runId?: string

  constructor(url: string, opts: SlackMessageBuilderOptions) {
    this.webhook = new IncomingWebhook(url, {
      username: opts.username || 'SARIF results',
      icon_url: opts.iconUrl
    })
    this.color = opts.color
    this.sarif = opts.sarif
    this.gitHubServerUrl = process.env.GITHUB_SERVER_URL || 'https://github.com'
  }

  withHeader(header?: string): void {
    this.header = {
      type: 'header',
      text: {
        type: 'plain_text',
        text: header || process.env.GITHUB_REPOSITORY || 'SARIF results'
      }
    }
  }

  withActor(actor?: string): void {
    this.actor = actor || process.env.GITHUB_ACTOR
  }

  withRun(): void {
    this.runId = process.env.GITHUB_RUN_ID
  }

  withFooter(footer?: string): void {
    const repoName = 'fabasoad/sarif-to-slack-action'
    this.footer = {
      type: 'context',
      elements: [{
        type: footer ? 'plain_text' : 'mrkdwn',
        text: footer || `Generated by <${this.gitHubServerUrl}/${repoName}|${repoName}>`
      }],
    }
  }

  async send(): Promise<string> {
    const blocks: AnyBlock[] = []
    if (this.header) {
      blocks.push(this.header)
    }
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: this.buildText()
      }
    })
    if (this.footer) {
      blocks.push(this.footer)
    }
    const { text } = await this.webhook.send({
      attachments: [{ color: this.color, blocks }]
    })
    return text
  }

  private buildText(): string {
    const text: string[] = []
    if (this.actor) {
      const actorUrl = `${this.gitHubServerUrl}/${this.actor}`
      text.push(`_Triggered by <${actorUrl}|${this.actor}>_`)
    }
    text.push(this.composeSummary())
    if (this.runId) {
      let runText: string = 'Job '
      if (process.env.GITHUB_REPOSITORY) {
        runText += `<${this.gitHubServerUrl}/${process.env.GITHUB_REPOSITORY}/actions/runs/${this.runId}|#${this.runId}>`
      } else {
        runText += `#${this.runId}`
      }
      text.push(runText)
    }
    return text.join('\n')
  }

  private composeRunSummary(toolName: string, map: Map<string, number>): string {
    const levelsText: string[] = []
    for (const [level, count] of map.entries()) {
      const levelCapitalized = level.charAt(0).toUpperCase() + level.slice(1)
      levelsText.push(`*${levelCapitalized}*: ${count}`)
    }
    return `*${toolName}*\n${levelsText.join(', ')}`
  }

  private composeSummary(): string {
    const data = new Map<string, Map<string, number>>()
    for (const run of this.sarif.runs) {
      const toolName = run.tool.driver.name
      if (!data.has(toolName)) {
        data.set(toolName, new Map<string, number>())
      }
      const results: Result[] = run.results ?? []
      for (const result of results) {
        const level: string = this.tryGetLevel(run, result)
        const count: number = data.get(toolName)?.get(level) || 0
        data.get(toolName)?.set(level, count + 1)
      }
    }
    const summaries: string[] = []
    for (const [toolName, map] of data.entries()) {
      summaries.push(this.composeRunSummary(toolName, map))
    }
    return summaries.join('\n')
  }

  private tryGetLevel(run: Run, result: Result): string {
    if (result.level) {
      return result.level
    }

    const ruleData: RuleData = {}

    if (result.rule) {
      if (result.rule?.index) {
        ruleData.index = result.rule.index
      }
      if (result.rule?.id) {
        ruleData.id = result.rule.id
      }
    }

    if (!ruleData.index && result.ruleIndex) {
      ruleData.index = result.ruleIndex
    }

    if (ruleData.index
      && run.tool.driver?.rules
      && ruleData.index < run.tool.driver.rules.length) {
      const rule: ReportingDescriptor = run.tool.driver.rules[ruleData.index]
      if (rule.properties && 'problem.severity' in rule.properties) {
        return rule.properties['problem.severity'] as string
      }
    }

    return 'unknown'
  }
}
