
const axios = require('axios')

import { getTokenHolders, Owner } from "./relayx";

import BigNumber from 'bignumber.js'

const MINIMUM = 1000;

interface PayoutOptions {
    token: string;
    minimum: number;
    currency?: string;
    amount: number;
}

async function convertToSatoshis(currency: string, amount: number) {

    const { data } = await axios.get(`https://api.anypayx.com/convert/${amount}-${currency}/to-BSV`)

    return data.conversion.output.value * 100_000_000

}

export async function getPayouts(params: PayoutOptions): Promise<Owner[]> {

    const satoshis = params.amount

    const { data } = await getTokenHolders(params.token)

    const total = data.owners.reduce((sum, owner) => {

        return sum + owner.amount

    }, 0)

    return data.owners.map(owner => {

        var share = parseInt(new BigNumber(owner.amount).dividedBy(total).times(satoshis).toNumber().toString())

        if (share < MINIMUM) {

            share = MINIMUM
        }

        return {
            address: owner.address,
            paymail: owner.paymail,
            amount: share
        }
    })

}
