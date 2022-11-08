
import { onchain } from 'stag-wallet'

import { log } from './log'

const axios = require('axios')

export async function findAll({where}: {where: any, limit?: number, offset?: number, order?: string[][] }) {

  const params: any = {}

  if (where.app) { params['app'] = where.app }

  if (where.author) { params['author'] = where.author }

  if (where.type) { params['type'] = where.type }

  if (where.content) {

    Object.keys(where.content).forEach(key => {

      params[key] = where.content[key]

    })

  }

  const query = new URLSearchParams(params).toString()

  const url = `https://onchain.sv/api/v1/events?${query}`

  log.debug('onchain.sv.events.get', { url })

  const { data } = await axios.get(url)

  log.debug('onchain.sv.events.get.result', { url, data })

  return data.events

}


export async function findOrCreate({where, defaults}: {where: any, defaults: any}) {

  var isNew = false

  var [record] = await findAll({ where })

  if (!record) {

    isNew = true

    if (defaults.type && !defaults.key) {
      defaults.key = defaults.type
      delete defaults.type
    }

    if (defaults.content && !defaults.val) {
      defaults.val = defaults.content
      delete defaults.content
    }

    const postResult = await onchain.post(defaults)

    await onchain.findOne(where)

    record = await onchain.findOne(where)

  }

  return [record, isNew]

}
