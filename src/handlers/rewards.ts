import * as moment from "moment";
import log from "../log";
import { getTokenHolders, Owner, OwnersResponse } from "../relayx"

import { Script, Address } from 'bsv'
import config from "../config";

import { badRequest } from 'boom'
import { getPayouts } from "../owners";

import BigNumber from 'bignumber.js'

export async function create(req, h) {

    try {
  
      var { currency, amount, token, minimum } = req.params
  
      if (!currency) { currency = 'USD' }
    
      if (!amount) { amount = 1 }

      if (!minimum) { minimum = 1000 }

      const response: OwnersResponse = await getTokenHolders(token)

      log.info('token.holders', response)

      const owners = await getPayouts({
        token,
        currency,
        amount,
        minimum
      })

      const payees = owners.map(owner => {
        return {
            script: Script.fromAddress(new Address(owner.address)).toHex(),
            amount: owner.amount
        }
      })

      const total = owners.reduce((sum, owner) => {
        return sum + owner.amount
      }, 0)

      payees.push({
        script: Script.fromAddress('14iPY3oZDcrqmMx2ESUHdukzKrRyz5LpPR').toHex(), // midasmulligan@relayx.io
        amount: parseInt(new BigNumber(total).times(0.01).toNumber().toString())
      })
    
      const payment_request = {
        network: 'bitcoin-sv',
        memo: `Reward to ${response.data.contract.symbol} Holders`,
        merchantData: JSON.stringify({
          avatarUrl: `https://bitcoinfileserver.com/${response.data.contract.icon.berry.split('_')[0]}`
        }),
        creationTimestamp: moment().unix(),
        expirationTimestamp: moment().add(1, 'hour').unix(),
        paymentUrl: `${config.get('api_base')}/api/v1/transactions`,
        outputs: payees
      }
    
      log.debug('payment-request.new', { payment_request })
    
      return payment_request
    
    } catch(error) {

        console.log(error)
  
      log.error(error)
  
      return badRequest(error)
  
    }
  
  }
