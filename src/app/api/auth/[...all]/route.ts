import { toNextJsHandler } from 'better-auth/next-js';

import { getAuth } from '@/lib/auth-server';

// `getAuth()` needs the request-scoped D1 binding, so resolve it per request
// instead of capturing a handler at module scope.
const handler = toNextJsHandler(async (request) => getAuth().handler(request));

export const GET = handler.GET;
export const POST = handler.POST;
