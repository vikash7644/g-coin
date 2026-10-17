import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import { setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '').trim();

  if (!email || !password) {
    return NextResponse.redirect(new URL('/login?error=missing-fields', request.url));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(new URL('/login?error=invalid-credentials', request.url));
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.redirect(new URL('/login?error=invalid-credentials', request.url));
  }

  setSessionCookie({
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
