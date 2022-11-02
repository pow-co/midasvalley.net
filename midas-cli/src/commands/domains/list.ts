
import {Command} from '@oclif/core'

import { listDomains, Domain } from '../../domains'

export default class ListDomains extends Command {
  static description = 'List Domains In MidasValley.Net Watch List'

  public static enableJsonFlag = true

  static examples = [
    `<%= config.bin %> <%= command.id %>`,
  ]

  static flags = {}

  static args = []

  async run(): Promise<Domain[]> {

    this.log('Fetching MidasValley onchain domains list...')

    const domains = await listDomains()

    this.log(`${domains.length} domains found in the MidasValley watchlist:`)

    return domains
  }
}
