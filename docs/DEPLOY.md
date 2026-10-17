# DEPLOY: S3 uploads, SMTP, and rotate-admin

This document covers the D+B task: finalize S3 presigned uploads, SMTP wiring, and a rotate-admin helper script for production.

1) S3 presigned uploads (client flow)

- Client requests a presigned URL:

  POST /api/upload/presign
  Body: { "filename": "screenshot.png", "contentType": "image/png" }

- Server returns: { ok: true, url: "https://...", key: "uploads/..-screenshot.png" }
- Client uploads directly to S3: PUT url with file body and Content-Type header
- Client saves the returned key to the project's submission record (or passes it to server-side submission flow)

Client upload example (browser):

```js
async function sendScreenshot(file) {
  // 1) get presign URL
  const res = await fetch('/api/upload/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });
  const { url, key } = await res.json();

  // 2) upload file
  await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });

  // 3) use `key` to save to DB in submission
  await fetch('/api/submissions', { method: 'POST', body: new FormData(submissionForm) });
}
```

2) SMTP (email) wiring

- Set `SMTP_URL` in production env.
- `lib/mailer.ts` will use that to send messages (admin approval, mint ready, trade receipts).
- If you use SendGrid, create SMTP credentials and set `SMTP_URL="smtp://USER:PASSWORD@smtp.sendgrid.net:587"`.
- Verify sending by triggering an approval and checking the console or SMTP logs.

3) rotate-admin script

- `scripts/rotate-admin.ts` allows you to safely rotate the admin password from a secure environment.

Usage examples:

- Using environment variables (CI/host shell):
  ADMIN_EMAIL="admin@gcoin.com" NEW_ADMIN_PASSWORD="SuperSecret123!" npx ts-node scripts/rotate-admin.ts

- Or pass as CLI args:
  npx ts-node scripts/rotate-admin.ts admin@gcoin.com SuperSecret123!

After rotating admin password, remove default seeded admin or update seed logic.

4) .env.production.example

- A template has been added. Fill the values in your host provider (Vercel, Railway) or in your .env file before running containers.

5) Verifying in production

- After deploying and running migrations + seed, login with the admin account and rotate the password.
- Test screenshot upload via the app (submit-work flow). Ensure uploads are stored in S3 and the keys are saved in DB.
- Test email delivery by approving a submission and checking the recipient mailbox.

If you want, I can now:
- A) Add a small server-side endpoint that serves uploaded files from S3 through a CDN-friendly URL (signed if private), or
- B) Add a frontend component for screenshot uploads using the `lib/upload-file.ts` helper, or
- C) Add a GitHub Actions workflow step that checks for required env vars and fails if missing on merge.

Tell me which follow-up (A/B/C) you'd like, or I can proceed to create A + B as small PRs in the repo.
