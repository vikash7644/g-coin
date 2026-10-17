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
  const price = Number(formData.get('price') || 0);

  if (!assetId || !price) {
    return NextResponse.redirect(new URL('/dex?error=missing-data', request.url));
  }

  const asset = await prisma.mintedAsset.findUnique({
    where: { id: assetId },
    include: { owner: true },
  });

  if (!asset || asset.ownerId === user.id) {
    return NextResponse.redirect(new URL('/dex?error=invalid-asset', request.url));
  }

  const royaltyAmount = price * 0.04;

  await prisma.trade.create({
    data: {
      assetId: asset.id,
      buyerId: user.id,
      sellerId: asset.ownerId,
      price,
      feePercent: 4.5,
      status: 'COMPLETED',
    },
  });

  if (asset.isStaked) {
    await prisma.royaltyLedger.create({
      data: {
        assetId: asset.id,
        holderId: asset.ownerId,
        amount: royaltyAmount,
        reason: 'Hold/staking reward payout',
      },
    });
  }

  await prisma.mintedAsset.update({
    where: { id: asset.id },
    data: {
      ownerId: user.id,
      salePrice: price,
    },
  });

  return NextResponse.redirect(new URL('/dex?success=trade-complete', request.url));
}
