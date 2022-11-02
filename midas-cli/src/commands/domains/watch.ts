import {Command, Flags} from '@oclif/core'

import { Domain, watchDomain } from '../../domains'

export default class WatchDomain extends Command {
  static description = 'Add Domain To The MidasValley Watch List'

  public static enableJsonFlag = true

  static examples = [
    `<%= config.bin %> <%= command.id %>`,
  ]

  static flags = {
    domain: Flags.string({
      required: true,
      char: 'd'
    })
  }

  static args = []

  async run(): Promise<Domain> {

    const {flags} = await this.parse(WatchDomain)

    const { domain } = flags

    this.log(`watch domain: ${domain}`)

    const record = await watchDomain(domain)

    return record
  }
}
