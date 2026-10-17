import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import { setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get('username') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '').trim();

  if (!username || !email || !password) {
    return NextResponse.redirect(new URL('/register?error=missing-fields', request.url));
  }

  if (password.length < 6) {
    return NextResponse.redirect(new URL('/register?error=weak-password', request.url));
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    return NextResponse.redirect(new URL('/register?error=user-exists', request.url));
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'USER',
    },
  });

  setSessionCookie({
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
