import type { IncomingMessage, ServerResponse } from 'http'
import { readBody } from 'h3'

export default async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') return res.end('Method not allowed')

    // @ts-ignore
    const {user} = await readBody(req)

    // console.log("User: ", user);

    // @ts-ignore
    req.user = user;

    // return updated: true
    res.end(JSON.stringify({ updated: true }))

}