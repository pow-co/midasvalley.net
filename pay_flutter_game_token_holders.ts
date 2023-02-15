
require('dotenv').config()

import delay from 'delay'

import { Script, Address } from 'bsv'

const { HDPublicKey, HDPrivateKey, Transaction } = require('bsv')

const pubkey = new HDPublicKey(process.env.MIDAS_HD_PUBLIC_KEY)

const hdprivkey = new HDPrivateKey(process.env.MIDAS_HD_PRIVATE_KEY)

const axios = require('axios')

import { onchain, loadWallet, Client } from 'stag-wallet'

import { Wallet } from 'stag-wallet'

import { getPayouts } from './src/owners'

import BigNumber from 'bignumber.js'

import * as polynym from 'polynym'

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

export async function payTokenHolders({
  domain,
  origin
}: {
  domain: string,
  origin: string

}): Promise<{txhex: string, txid: string} | null> {


  const wallet = await getRevenueWalletForDomain(domain)

  const balances = await wallet.balances()

  console.log(balances)

  const amount = balances[0].value_usd - 0.01

  if (amount <= 0.01) {

    console.log('zero balance', balances[0])
    return null;
  }

  const currency = 'USD'

  const url = `https://midasvalley.net/api/v1/rewards/new/${origin}/${amount}-${currency}`

  const { data: bip270 } = await axios.get(url)

  //const { outputs } = bip270

  //console.log({ outputs })

  const owners = await getPayouts({
    token: origin,
    amount: balances[0].value
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

  const outputs = payees.map(({script,amount}) => ({script,amount})) 

  const txhex = await wallet.buildPayment({
    instructions: [
      {
        outputs
        //outputs
      }
    ]
  }, 'BSV')

  const txid = new Transaction(txhex).hash

  console.log({ txhex, txid })

  let { data: transmitResult } = await axios.post(bip270.paymentUrl, {

    transaction: txhex

  })

  console.log({ transmitResult })

  return { txhex, txid }

}


if (require.main === module) {
 
  ;(async () => {

    while (true) {

      const domain = 'flutter.game'

      //const token = await getTokenByDomain(domain)

      const origin = '8d32934f044bc2b480f0ffa5775a032286afcc5143d676b745fdec15eae878d9_o2'

      const result = await payTokenHolders({ domain, origin })

      console.log('payTokenHolders.result', result)

      await delay(10000)

    }

  })();

}

