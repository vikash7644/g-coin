import { NextRequest, NextResponse } from 'next/server';

import { clearSessionCookie } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  clearSessionCookie();
  return NextResponse.redirect(new URL('/login', _request.url));
}
