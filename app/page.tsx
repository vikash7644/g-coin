import { redirect } from 'next/navigation';

import { NavBar } from '@/components/NavBar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function HomePage() {
  const user = await getCurrentUser();

  const [totalUsers, totalSubmissions, totalAssets, totalTrades] = await Promise.all([
    prisma.user.count(),
    prisma.submission.count(),
    prisma.mintedAsset.count(),
    prisma.trade.count(),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-yellow-400/40 bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
            Proof-of-real-work ecosystem
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight md:text-6xl">
            Gas pe nahi, <span className="text-yellow-300">Kaam pe banta hai</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-300">
            G-COIN turns verified software work into an off-chain mintable asset. No wallet, no gas, no fake FMV — only real build value.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {!user ? (
              <>
                <a href="/register" className="rounded bg-yellow-400 px-6 py-3 font-semibold text-slate-900 hover:bg-yellow-300">
                  Start building
                </a>
                <a href="/submit-work" className="rounded border border-white/20 px-6 py-3 font-semibold text-white hover:border-yellow-400/50 hover:text-yellow-300">
                  Submit work
                </a>
              </>
            ) : (
              <a href="/dashboard" className="rounded bg-yellow-400 px-6 py-3 font-semibold text-slate-900 hover:bg-yellow-300">
                Open dashboard
              </a>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-yellow-950/60 p-8 shadow-glow">
          <div className="mb-6 text-center text-sm uppercase tracking-[0.3em] text-yellow-300">G-COIN Asset</div>
          <div className="flex justify-center">
            <div className="rounded-full border border-yellow-300/40 bg-slate-950 p-4 shadow-glow">
              <div className="h-56 w-56 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-700 p-3">
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-yellow-900/70 bg-gradient-to-br from-yellow-200 to-yellow-700 text-6xl font-black text-slate-900 shadow-inner">
                  G
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm text-slate-200">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-2xl font-black text-yellow-300">{totalUsers}</div>
              <div className="mt-1 text-xs uppercase tracking-wide">Builders</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-2xl font-black text-yellow-300">{totalSubmissions}</div>
              <div className="mt-1 text-xs uppercase tracking-wide">Work</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-2xl font-black text-yellow-300">{totalAssets}</div>
              <div className="mt-1 text-xs uppercase tracking-wide">Minted</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Proof of real work',
              text: 'Every asset starts from a public project, a demo URL, and a verified repository.',
            },
            {
              title: 'Supply-based price',
              text: 'Value is rooted in build quality, utility, and demand rather than fake gas-price hype.',
            },
            {
              title: 'Stake-powered royalties',
              text: 'Hold and stake to qualify for reward distributions and longer-term royalty cycles.',
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-3 h-10 w-10 rounded-full bg-yellow-500/15 text-center text-lg leading-10 text-yellow-300">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-3 text-slate-300">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
