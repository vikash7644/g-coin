import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const submissionId = String(formData.get('submissionId') || '').trim();
  const projectTitle = String(formData.get('projectTitle') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const techStackUsed = String(formData.get('techStackUsed') || '').trim();

  if (!submissionId || !projectTitle || !description || !techStackUsed) {
    return NextResponse.redirect(new URL('/mint?error=missing-fields', request.url));
  }

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (!submission || submission.userId !== user.id || submission.status !== 'APPROVED') {
    return NextResponse.redirect(new URL('/mint?error=not-eligible', request.url));
  }

  if (!submission.mintToken || !submission.mintTokenExpiresAt || new Date(submission.mintTokenExpiresAt).getTime() < Date.now()) {
    return NextResponse.redirect(new URL('/mint?error=token-expired', request.url));
  }

  const existingMint = await prisma.mintedAsset.findUnique({ where: { submissionId: submission.id } });
  if (existingMint) {
    return NextResponse.redirect(new URL('/mint?error=already-minted', request.url));
  }

  const editionNumber = (await prisma.mintedAsset.count()) + 1;
  const rarity = editionNumber <= 10 ? 'LEGENDARY' : editionNumber <= 30 ? 'EPIC' : 'RARE';

  await prisma.mintedAsset.create({
    data: {
      submissionId: submission.id,
      ownerId: user.id,
      editionNumber,
      rarity,
      totalSupply: 100,
      mintPrice: 149,
      salePrice: 149,
      isStaked: false,
    },
  });

  await prisma.submission.update({
    where: { id: submission.id },
    data: {
      mintToken: null,
      mintTokenExpiresAt: null,
    },
  });

  return NextResponse.redirect(new URL('/profile?success=mint-created', request.url));
}
