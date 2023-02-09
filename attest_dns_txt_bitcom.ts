
require('dotenv').config()

const { HDPublicKey } = require('bsv')

const pubkey = new HDPublicKey(process.env.MIDAS_HD_PUBLIC_KEY)

import { onchain } from 'stag-wallet'

import { findOrCreate } from './src/onchain'

import { attestTxtBitcom } from './src/dns'

async function run() {

  const domain = process.argv[2] || 'egoboost.vip'

  console.log('attest.domain', { domain })

  const attest = await attestTxtBitcom(domain)

  console.log({ attest })

  const domainResult = await onchain.findOne({
    app: 'midasvalley.net',
    type: 'watch_domain',
    content: {
      domain
    }
  })

  console.log({ domainResult })

  if (domainResult.id) {

    const address = pubkey.deriveChild(domainResult.id).publicKey.toAddress().toString()

    console.log({ address })

    const result = await findOrCreate({
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

    for (let event of result) {

      console.log(event.content)

    }

  }

}

run()

