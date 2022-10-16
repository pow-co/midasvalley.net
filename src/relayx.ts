import log from "./log";

const axios = require('axios')

export interface Owner {
    address: string;
    amount: number;
    paymail: string;
}

export interface OwnersResponse {
    code: number;
    data: {
        contract: {
            burned: number;
            description: string;
            icon: {
                berry: string;
            };
            isEncrypted: boolean;
            issued: number;
            location: string;
            name: string;
            nft: boolean;
            nonce: number;
            origin: string;
            owner: string;
            royalties: any[];
            symbol: string;
            whitepaper: string;
        };
        owners: Owner[];
    }
}

export async function getTokenHolders(token: string): Promise<OwnersResponse> {

    log.info('relayx.getTokenHolders', { token })

    const ownersURL = `https://staging-backend.relayx.com/api/token/${token}/owners`

    const response = await axios.get(ownersURL)

    const data: OwnersResponse = response.data;

    log.info('relayx.getTokenHolders.result', data)

    return data

}