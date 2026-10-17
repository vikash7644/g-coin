import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const submissionId = String(formData.get('submissionId') || '').trim();
  const decision = String(formData.get('decision') || '').trim();
  const reason = String(formData.get('reason') || '').trim();

  if (!submissionId || !decision) {
    return NextResponse.redirect(new URL('/admin/verify?error=missing-data', request.url));
  }

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission) {
    return NextResponse.redirect(new URL('/admin/verify?error=not-found', request.url));
  }

  if (decision === 'APPROVE') {
    const mintToken = crypto.randomUUID();
    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: 'APPROVED',
        mintToken,
        mintTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        approvedAt: new Date(),
        reason: null,
      },
    });

    return NextResponse.redirect(new URL('/admin/verify?success=approved', request.url));
  }

  await prisma.submission.update({
    where: { id: submission.id },
    data: {
      status: 'REJECTED',
      reason: reason || 'Rejected by admin',
      mintToken: null,
      mintTokenExpiresAt: null,
    },
  });

  return NextResponse.redirect(new URL('/admin/verify?success=rejected', request.url));
}
