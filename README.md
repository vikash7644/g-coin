# G-COIN

G-COIN is an off-chain build-to-mint platform where developers submit real software work for verification. Only verified submissions can mint a G-COIN asset. The system is built around proof-of-real-work rather than gas-driven speculative NFT minting.

Tagline:
"Gas pe nahi, Kaam pe banta hai"

## Mission

Current NFT systems often reward gas fees and speculation rather than real engineering. G-COIN flips that logic:

- Real software project → verification → mint
- No blockchain
- No wallet connect
- No gas fees
- No wallet requirement
- Proof-of-work comes from public code + live demo + admin review

## Product philosophy

The system is intentionally off-chain and built around a trustable internal economy:

- Developers submit public software projects
- Admin reviews repos and demo links
- Only approved work can mint a G-COIN asset
- Assets get supply-based value logic instead of fake FMV speculation
- Traders can buy/sell assets in the DEX
- Holders can stake and earn rewards/royalty-like distributions

## Key features

- Developer registration and login
- Work submission form with public repo and demo URL
- Admin verification panel at /admin/verify
- Mint token system valid for 24 hours after approval
- Auto-generated rarity and edition assignment
- 3D gold coin canvas visual using HTML canvas
- Off-chain DEX marketplace simulation
- Staking and royalty ledger tracking
- S3 upload support for screenshots
- Worker-based royalty-distribution job
- Production-ready Docker/CI/CD setup

## Tech stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development
- Postgres for production
- Redis + BullMQ for worker queueing
- AWS S3 / Cloudflare R2 for uploads
- SMTP or Resend / SendGrid for email

## Project structure

```bash
.
├── app/
│   ├── admin/
│   ├── api/
│   ├── dashboard/
│   ├── dex/
│   ├── login/
│   ├── mint/
│   ├── profile/
│   ├── register/
│   ├── submit-work/
│   ├── _s3/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CoinCanvas.tsx
│   ├── NavBar.tsx
│   ├── SubmitWorkForm.tsx
│   └── UploadDropzone.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── mailer.ts
│   ├── upload-file.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── scripts/
│   └── rotate-admin.ts
├── worker/
│   └── royaltyWorker.ts
├── .env.example
├── .env.production.example
├── .github/workflows/
│   └── ci-cd.yml
├── docker-compose.yml
├── Dockerfile
├── docs/
│   └── DEPLOY.md
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── README.md
├── README.PRODUCTION.md
└── .gitignore
```

## Local development

### 1) Install dependencies

```bash
npm install
```

### 2) Copy env file

```bash
cp .env.example .env
```

Example values:

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="your_local_secret"
REDIS_URL="redis://localhost:6379"
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
S3_BUCKET=""
SMTP_URL=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3) Prisma setup

```bash
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed
```

### 4) Start app

```bash
npm run dev
```

Open:

- http://localhost:3000

## Default admin credentials

- Email: admin@gcoin.com
- Password: admin123

Important:
- Change this immediately after first login or before production deploy.

## Important production changes

- Use Postgres, not SQLite
- Use Redis for the worker
- Use S3 or R2 for screenshots
- Use SMTP / SendGrid / Resend for emails
- Protect admin routes and auth in production

## Production deployment

### Vercel + Postgres + Redis + S3

Use the environment variables in `.env.production.example`.

Recommended production stack:

- App: Vercel
- DB: Neon / Supabase / Railway / managed Postgres
- Redis: Upstash / Railway / Redis Cloud
- Storage: AWS S3 or Cloudflare R2
- Mail: SendGrid / Resend / SMTP
- Worker: Railway / Render / Docker host

See `docs/DEPLOY.md` for the full production guide.

### Docker quick start

```bash
docker-compose up --build
```

### Worker quick start

```bash
REDIS_URL=redis://localhost:6379 npm run start:worker
```

## Admin workflow

1. User registers and logs in
2. User submits work at /submit-work
3. Admin logs in as admin@gcoin.com
4. Admin approves or rejects at /admin/verify
5. Approved submissions receive a mint token valid for 24 hours
6. User visits /mint and mints a G-COIN asset
7. Asset can be traded in the DEX and staked for rewards

## S3 upload workflow

- Client requests a signed upload URL from `/api/upload/presign`
- Client uploads file directly to S3
- Browser stores the S3 key / proxy URL inside the submission record
- Images are served through `/_s3/<key>`

## Worker system

The worker (`worker/royaltyWorker.ts`) processes royalty distribution and repeat tasks using Redis and BullMQ patterns.

## Security notes

- Do not leave default admin credentials in production
- Use strong `AUTH_SECRET`
- Use Postgres in production
- Add rate limiting to auth and admin routes
- Do not expose DB or secret env values in git
- Test S3 bucket CORS and IAM permissions
- Monitor logs and errors with Sentry or Vercel logs

## License

MIT

## Support / next steps

The app is intentionally off-chain and not blockchain-based. If you want to expand it further, common next steps are:

- add stronger identity checks for verified contributors
- add email notifications for submission approval/rejection
- add file validation and AI moderation review
- add a proper analytics dashboard
- add more trading logic and market depth simulation
- add user reward vaults and staking distributions

## GitHub actions / CI/CD

The repo includes a production-ready CI/CD workflow under `.github/workflows/ci-cd.yml`.

It runs:

- install
- Prisma generation
- lint
- build
- deploy to Vercel on main push

## Final note

This project is intentionally built as a real off-chain software platform, not a blockchain app. The economic rules are simulated in a production-like web app with a solid code structure, API routes, database schema, and worker-based distribution layer.

For full deployment instructions, see:

- `docs/DEPLOY.md`
- `README.PRODUCTION.md`
- `.env.production.example`

Thank you for using G-COIN.
