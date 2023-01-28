
require('dotenv').config()

import { Script, Address, Transaction } from 'bsv'

const { HDPublicKey, HDPrivateKey } = require('bsv')

const pubkey = new HDPublicKey(process.env.MIDAS_HD_PUBLIC_KEY)

const hdprivkey = new HDPrivateKey(process.env.MIDAS_HD_PRIVATE_KEY)

const axios = require('axios')

import { onchain, loadWallet, Client } from 'stag-wallet'

import { Wallet } from 'stag-wallet/dist/pow-co/stag-wallet/src/wallet'

import { getPayouts } from './src/owners'

import BigNumber from 'bignumber.js'

import * as polynym from 'polynym'

import delay from 'delay'

async function getRevenueWalletForDomain(domain: string): Promise<Wallet> {

  const domainResult = await onchain.findOne({
    app: 'midasvalley.net',
    type: 'watch_domain',
    content: {
      domain
    }
  })

  if (!domainResult || !domainResult.id) {

    throw new Error('Domain Not On Watch List')

  }

  const address = pubkey.deriveChild(domainResult.id).publicKey.toAddress().toString()

  const privatekey = hdprivkey.deriveChild(domainResult.id).privateKey

  const wallet = await loadWallet([{
    asset: 'BSV',
    privatekey: privatekey.toWIF(),
    address
  }])

  return wallet

}

async function getTokenByDomain(domain: string): Promise<string> {

  const result = await onchain.findOne({
    app: 'midasvalley.net',
    type: 'attest_dns_txt_bitcom',
    content: {
      domain
    }
  })

  if (!result || !result.content.bitcom) {

    throw new Error('Domain Bitcom Not Set')

  }

  const { content: { bitcom } } = result

  const tokenResult = await onchain.findOne({
    app: 'midasvalley.net',
    type: 'set_token',
    author: bitcom
  })

  if (!tokenResult) {

    throw new Error('Domain Token Not Set')
  }

  console.log({ tokenResult })

  return tokenResult.content.origin
  
}

async function run() {

  const domain = 'wyatthash.com'

  //const token = await getTokenByDomain(domain)

  const origin = '623d69062287dfcf2dfa908018c7910bb670c7a1667628be5a030e6cd82233d8_o2'

  const wallet = await getRevenueWalletForDomain(domain)

  const balances = await wallet.balances()

  console.log("BALANCES", balances)

  const amount = balances[0].value - 2180

  if (amount < 218000) { return }

  const url = `https://midasvalley.net/api/v1/rewards/new/${origin}/${amount}-USD`

  const { data: bip270 } = await axios.get(url)

  const owners = await getPayouts({
    token: origin,
    amount,
    minimum: 1
  })

  console.log({ owners })

  const payees = await Promise.all(owners.map(async owner => {

    const { address } = await polynym.resolveAddress(owner.paymail)

    console.log('polynym.result', { result: address, paymail: owner.paymail })

    return {
        address,
        script: Script.fromAddress(new Address(address)).toHex(),
        amount: owner.amount
    }
  }))

  console.log({ payees })

  const total = owners.reduce((sum, owner) => {
    return sum + owner.amount
  }, 0)

  console.log('TOTAL', { total, amount })

  const outputs = payees.map(({script,amount}) => ({script,amount})) 

  const transaction = await wallet.buildPayment({
    instructions: [
      {
        outputs
        //outputs
      }
    ]
  }, 'BSV')

  console.log({ transaction })

  let { data: transmitResult } = await axios.post(bip270.paymentUrl, {

    transaction

  })

  const tx = new Transaction(transmitResult)

  const txid = tx.hash

  const txhex = tx.serialize()

  console.log('transmit.result', { txhex, txid })

  return { txhex, txid }

}

export async function start() {

  while (true) {

    try {

      await run()

    } catch(error) {

      console.error('wyatthash.paycontinuosly.error', error)

    }

    await delay(1000 * 60)

  }

}

if (require.main === module) {
  
  start()

}
