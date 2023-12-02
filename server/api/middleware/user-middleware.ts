import type { IncomingMessage, ServerResponse } from 'http'
import { getCookie } from 'h3'

export default async (req: IncomingMessage, res: ServerResponse) => {
  if (!res) {
    throw new Error('Response object is undefined');
  }

  // @ts-ignore
  const userCookie = getCookie(req, "userCookie");
  
  // @ts-ignore
  res.user = userCookie;
}