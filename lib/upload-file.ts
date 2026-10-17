/** Client-side helper to upload a File to S3 via the presign endpoint. */
export async function uploadFileToS3(file: File) {
  // Request a presigned URL from the server
  const presignRes = await fetch('/api/upload/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });

  if (!presignRes.ok) {
    const err = await presignRes.json().catch(() => ({}));
    throw new Error('Failed to get presigned URL: ' + (err?.error || presignRes.statusText));
  }

  const { url, key } = await presignRes.json();

  // Upload directly to S3 using the signed URL
  const uploadRes = await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
  if (!uploadRes.ok) {
    throw new Error('Upload failed: ' + uploadRes.statusText);
  }

  // Return the storage key so the server can persist it in DB
  return { key, url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/_s3/${key}` };
}
