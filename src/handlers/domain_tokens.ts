
import * as dns from 'dns'

import { promisify } from 'util'

import { log } from '../log'

import { badRequest } from 'boom'

const resolveTxt = promisify(dns.resolveTxt)

export async function show(req, h) {

  log.info('api.handlers.domain_tokens.show', req.params)

  try {

    const { domain } = req.params

    log.info('api.handlers.domain_tokens.show', { domain })

    const result = await resolveTxt(domain)

    log.info('api.handlers.domain_tokens.show.result', { domain, result })

    return {

      domain, result

    }

  } catch(error) {

    log.error('api.handlers.domain_tokens.show.error', error)

    return badRequest(error)

  }

}
