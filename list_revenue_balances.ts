
require('dotenv').config()

import { onchain } from 'stag-wallet'

import { findAll } from './src/onchain'

import axios from 'axios'

async function run() {

  const revenueAddresses = await findAll({
    where: {
      app: 'midasvalley.net',
      type: 'set_revenue_address',
      author: '1KhvUBTJsZPGJnvZPxRPQctB2dBtCMsUHA'
    }
  })

  for (let event of revenueAddresses) {

    if (event.content.domain) {

      console.log(event.content)

    }
  }
}

run()

