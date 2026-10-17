import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const projectTitle = String(formData.get('projectTitle') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const githubRepoUrl = String(formData.get('githubRepoUrl') || '').trim();
  const liveDemoUrl = String(formData.get('liveDemoUrl') || '').trim();
  const techStackUsed = String(formData.get('techStackUsed') || '').trim();
  const videoDemoUrl = String(formData.get('videoDemoUrl') || '').trim();
  const rawScreenshots = String(formData.get('screenshots') || '').trim();

  if (!projectTitle || !description || !githubRepoUrl || !liveDemoUrl || !techStackUsed || !rawScreenshots) {
    return NextResponse.redirect(new URL('/submit-work?error=missing-fields', request.url));
  }

  const screenshots = rawScreenshots
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  const workHash = crypto.createHash('sha256').update(`${githubRepoUrl}:${Date.now()}`).digest('hex');

  await prisma.submission.create({
    data: {
      userId: user.id,
      projectTitle,
      description,
      githubRepoUrl,
      liveDemoUrl,
      techStackUsed,
      videoDemoUrl: videoDemoUrl || null,
      screenshots: JSON.stringify(screenshots),
      status: 'PENDING',
      workHash,
    },
  });

  return NextResponse.redirect(new URL('/dashboard?success=submission-created', request.url));
}
