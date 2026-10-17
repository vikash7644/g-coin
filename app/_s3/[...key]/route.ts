import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(request: NextRequest, { params }: { params: { key: string[] } }) {
  const region = process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET;
  if (!region || !bucket) return NextResponse.json({ ok: false, error: 'S3 not configured' }, { status: 500 });

  const keyParts = params?.key || [];
  const key = keyParts.map(decodeURIComponent).join('/');

  const client = new S3Client({ region });
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return NextResponse.redirect(url);
  } catch (err) {
    console.error('s3 get signed url error', err);
    return NextResponse.json({ ok: false, error: 'get-signed-url-failed' }, { status: 500 });
  }
}
