import { getInput } from '@actions/core'
import { IncomingWebhook } from '@slack/webhook'
// import { promises as fs } from 'fs'

async function run() {
  const webhookUrl: string = getInput('slack-webhook')
  const sarifPath: string = getInput('sarif-path')
  const color: string = getInput('color')
  // const jsonString = await fs.readFile(sarifPath, 'utf8')
  // const sarif = JSON.parse(jsonString)
  const webhook = new IncomingWebhook(webhookUrl, {
    username: 'Application Security',
    icon_url: 'https://cdn-icons-png.flaticon.com/512/9070/9070006.png'
  })

  const repo = 'wp-appsec/github-actions-dashboard'
  const actor = 'yevhen-fabizhevskyi_stargate'
  const analysisType = 'IaC analysis'
  const critical = 0
  const high = 0
  const medium = 3
  const low = 6
  const info = 0
  const jobUrl = 'https://job-url.com'
  const jobId = '12345'
  const { text } = await webhook.send({
    attachments: [
      {
        color: '#FF0000',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: analysisType
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${repo}*\n_Triggered by *${actor}*_\n*CRITICAL*: ${critical}, *HIGH*: ${high}, *MEDIUM*: ${medium}, *LOW*: ${low}, *INFO*: ${info}\nJob <${jobUrl}|#${jobId}>`,
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
