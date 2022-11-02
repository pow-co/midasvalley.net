
const axios = require('axios')

const { onchain } = require('stag-wallet')

export interface Domain {
    domain: string;
    txid: string;
    txt_bitcom?: string;
    txt_token?: string;
}


const author = '1KhvUBTJsZPGJnvZPxRPQctB2dBtCMsUHA'

const app = 'midasvalley.net'

const type = 'watch_domain'


export async function listDomains(): Promise<Domain[]> {

    const { data } = await axios.get(`https://onchain.sv/api/v1/events?app=${app}&type=${type}&author=${author}`)

    return data.events.map((event: any) => {

        if (!event.content || !event.content.domain) { return }

        return {
            txid: event.txid,
            domain: event.content.domain
        }

    }).filter((event: any) => !!event)

}

export async function watchDomain(domain: string): Promise<Domain> {

    let record = await onchain.findOne({
        author,
        type,
        app,
        content: { domain }
    })

    let txid;

    if (record) {

    }

    if (record) {

        txid = record.txid

    } else {

        const postResult = await onchain.post({
            app,
            key: type,
            val: { domain }
        })

        txid = postResult.txid

        record = await onchain.findOne({
            author,
            type,
            app,
            content: { domain }
        })
    }

    return {
        txid,
        domain
    }

}
