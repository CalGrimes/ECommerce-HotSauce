import type { IncomingMessage, ServerResponse } from 'http'
import { getCookie } from 'h3'

export default async (req: IncomingMessage, res: ServerResponse) => {
  // @ts-ignore
  const userCookie = getCookie(req, "userCookie");
  
  // @ts-ignore
  res.user = userCookie;
}