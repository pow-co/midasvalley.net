
import * as dns from 'dns'

import { promisify } from 'util'

const resolveTxt = promisify(dns.resolveTxt)

interface Attestation {
    txid: string;
    domain: string;
    bitcom: string;
}

import { findOrCreate } from './onchain'

export async function getBitcomTxt(domain: string): Promise<string> {

    const txt = await resolveTxt(domain)

    var [[bitcom]] = txt.filter(([record]) => record.match(/^bitcom/))

    if (bitcom) {

        bitcom = bitcom.split(":")[1]

    }

    const [[onchain]] = txt.filter(([record]) => record.match(/^onchain/))

    if (onchain) {

        bitcom = onchain.split(":")[1]

    }

    return bitcom
}

export async function getBitcomAttestation(domain: string): Promise<Attestation | null> {

    const bitcom = await getBitcomTxt(domain)

    if (!bitcom) { return null }

    return {
        domain,
        txid: '',
        bitcom
    }

}

export async function attestTxtBitcom(domain: string): Promise<Attestation> {

    const bitcom = await getBitcomTxt(domain)

    if (!bitcom) { throw new Error('Bitcom TXT Record Not Set') }

    const txt = await resolveTxt(domain)

    const [record] = await findOrCreate({
        where: {
            app: 'midasvalley.net',
            type: 'attest_dns_txt_bitcom',
            content: {
                domain
            },
            author: process.env['BSV_BITCOM_ADDRESS']
        },
        defaults: {
            app: 'midasvalley.net',
            type: 'attest_dns_txt_bitcom',
            content: {
                domain,
                bitcom
            }
        }
    })

    const { txid } = record

    return {
        domain,
        bitcom,
        txid
    }

}