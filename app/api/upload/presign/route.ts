import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Basic whitelist for content types and extensions
const ALLOWED_CONTENT_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

function sanitizeFilename(name: string) {
  // remove path and unsafe chars
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 180);
}

export async function POST(request: NextRequest) {
  const region = process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET;

  if (!region || !bucket) {
    return NextResponse.json({ ok: false, error: 'S3 not configured' }, { status: 500 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  const { filename, contentType } = body as { filename?: string; contentType?: string };
  if (!filename || !contentType) return NextResponse.json({ ok: false, error: 'missing' }, { status: 400 });

  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    return NextResponse.json({ ok: false, error: 'unsupported-content-type' }, { status: 400 });
  }

  const ext = filename.includes('.') ? filename.substring(filename.lastIndexOf('.')).toLowerCase() : '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({ ok: false, error: 'unsupported-extension' }, { status: 400 });
  }

  const safeName = sanitizeFilename(filename);
  const key = `uploads/${Date.now()}-${safeName}`;

  const client = new S3Client({ region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return NextResponse.json({ ok: true, url, key });
  } catch (err) {
    console.error('presign error', err);
    return NextResponse.json({ ok: false, error: 'presign-failed' }, { status: 500 });
  }
}
