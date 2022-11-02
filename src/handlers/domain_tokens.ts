
import * as dns from 'dns'

import { promisify } from 'util'

import { log } from '../log'

import { badRequest } from 'boom'

const resolveTxt = promisify(dns.resolveTxt)

export async function show(req, h) {

  log.info('api.handlers.domain_tokens.show', req.params)

  const { domain } = req.params

  var result = []

  try {


    log.info('api.handlers.domain_tokens.show', { domain })

    result = await resolveTxt(domain)

    log.info('api.handlers.domain_tokens.show.result', { domain, result })


  } catch(error) {

    log.error('api.handlers.domain_tokens.show.error', error)

  }


  const [onchain] = result.filter(([record]) => {
    return record.match(/^onchain:/)
  })
  .map(([record]) => {
    return record.split(':')[1]
  })

  console.log('RESULT', onchain)

  return { domain, result, onchain }


}
