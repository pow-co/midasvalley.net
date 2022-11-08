
require('dotenv').config()

const { HDPublicKey } = require('bsv')

const pubkey = new HDPublicKey(process.env.MIDAS_HD_PUBLIC_KEY)

import { onchain } from 'stag-wallet'

import { findOrCreate, findAll } from './src/onchain'

async function run() {

  const events = await findAll({
    where: {
      app: 'midasvalley.net',
      type: 'watch_domain'
    }
  })

  for (let event of events) {

    const { content: { domain }, type } = event

    if (!domain || type !== 'watch_domain') {
      continue;
    }

    const address = pubkey.deriveChild(event.id).publicKey.toAddress().toString()

    const [result, isNew] = await findOrCreate({
      where: {
        app: 'midasvalley.net',
        type: 'set_revenue_address',
        content: {
          domain
        }
      },
      defaults: {
        app: 'midasvalley.net',
        key: 'set_revenue_address',
        content: {
          domain,
          address
        }
      }
    })

    if (isNew) {
      console.log(result)
    }

  }

}

run()

