import type { IncomingMessage, ServerResponse } from 'http'

export default async (req: IncomingMessage, res: ServerResponse) => {
    if (res.user) {
        res.end(res.user);
    } else {
        res.end("User is not signed in");
    }
}