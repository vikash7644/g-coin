import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const assetId = String(formData.get('assetId') || '').trim();
  const action = String(formData.get('action') || 'stake').trim();

  if (!assetId) {
    return NextResponse.redirect(new URL('/dex?error=missing-asset', request.url));
  }

  const asset = await prisma.mintedAsset.findUnique({ where: { id: assetId } });
  if (!asset || asset.ownerId !== user.id) {
    return NextResponse.redirect(new URL('/dex?error=not-owner', request.url));
  }

  const isStaking = action === 'stake';

  await prisma.mintedAsset.update({
    where: { id: asset.id },
    data: {
      isStaked: isStaking,
    },
  });

  if (isStaking) {
    await prisma.stake.create({
      data: {
        assetId: asset.id,
        userId: user.id,
        amount: asset.mintPrice,
        lockedUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });
  }

  return NextResponse.redirect(new URL('/dex?success=stake-updated', request.url));
}
