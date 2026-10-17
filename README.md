# G-COIN

G-COIN is an off-chain build-to-mint platform where developers submit real software work for verification. Only verified submissions can mint a G-COIN asset. The system is designed around proof-of-real-work rather than gas-driven, speculative NFT minting.

## Mission

"Gas pe nahi, Kaam pe banta hai"

## Core principles

- No blockchain
- No wallet connect
- No gas fees
- Proof-of-work is checked via public GitHub repo + live demo + admin verification
- Minting is off-chain and tied to verified software contribution
- Royalty and staking rewards are economy rules, not smart-contract logic

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- bcryptjs

## Scripts

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

## Default admin credentials

- Email: admin@gcoin.com
- Password: admin123

## Important

This project is intentionally off-chain. There is no blockchain or wallet integration.

## License

MIT
