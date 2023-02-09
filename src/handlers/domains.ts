import { findAll } from "../onchain";

export async function index(req, h) {

    const set_revenue_address_events = await findAll({
        where: {
            app: 'midasvalley.net',
            type: 'set_revenue_address',
            author: '1KhvUBTJsZPGJnvZPxRPQctB2dBtCMsUHA'
        }
    })

    const watch_domain_events = await findAll({
        where: {
            app: 'midasvalley.net',
            type: 'watch_domain',
            author: '1KhvUBTJsZPGJnvZPxRPQctB2dBtCMsUHA'
        }
    })

    return {
        watch_domain_events,
        domains: set_revenue_address_events.map(({content}) => content)
    }
    
}