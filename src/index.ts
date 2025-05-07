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
  const { text } = await webhook.send({
    blocks: [
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_section',
            elements: [
              {
                type: 'color',
                value: color
              }
            ]
          }
        ]
      }
    ]
  })
  console.log('Message sent:', text)
}

run()
