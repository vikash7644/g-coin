import { db } from '@/lib/db';

export async function GET() {
  return Response.json({ ok: true, message: 'G-COIN' });
}
