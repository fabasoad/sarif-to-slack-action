import { getInput } from '@actions/core'
import { IncomingWebhook } from '@slack/webhook'
// import { promises as fs } from 'fs'

async function run() {
  const webhookUrl: string = getInput('slack-webhook')
  const sarifPath: string = getInput('sarif-path')
  const color: string = getInput('color')
  // const jsonString = await fs.readFile(sarifPath, 'utf8')
  // const sarif = JSON.parse(jsonString)
  const webhook = new IncomingWebhook(webhookUrl)

  const repo = 'wp-appsec/github-actions-dashboard'
  const analysisType = 'IaC analysis'
  const critical = 0
  const high = 0
  const medium = 3
  const low = 6
  const info = 0
  const jobUrl = 'https://job-url.com'
  const jobId = '12345'
  const { text } = await webhook.send({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'yevhen-fabizhevskyi_stargate'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${repo}*\n_${analysisType}_\nCRITICAL: ${critical}, HIGH: ${high}, MEDIUM: ${medium}, LOW: ${low}, INFO: ${info}\nJob <${jobUrl}|${jobId}>`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Production Infrastructure Security team - @prodsec',
          },
          {
            type: 'image',
            image_url: 'https://cdn-icons-png.flaticon.com/512/9070/9070006.png',
            alt_text: 'icon',
          },
        ],
      },
    ]
  })
  console.log('Message sent:', text)
}

run()
