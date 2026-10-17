import { redirect } from 'next/navigation';

import { NavBar } from '@/components/NavBar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [submissionCount, mintedCount, stakeCount, tradeCount] = await Promise.all([
    prisma.submission.count({ where: { userId: user.id } }),
    prisma.mintedAsset.count({ where: { ownerId: user.id } }),
    prisma.stake.count({ where: { userId: user.id } }),
    prisma.trade.count({ where: { buyerId: user.id } }),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">Dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Welcome, {user.username}</h1>
          </div>
          <form action="/api/auth/logout" method="POST"><button className="rounded border border-white/10 px-4 py-2 text-sm hover:border-yellow-400/50 hover:text-yellow-300">Logout</button></form>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            ['Submissions', submissionCount],
            ['Minted', mintedCount],
            ['Stakes', stakeCount],
            ['Trades', tradeCount],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="text-sm uppercase tracking-[0.15em] text-slate-400">{label}</div>
              <div className="mt-4 text-3xl font-black text-yellow-300">{String(value)}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Quick actions</h2>
            <div className="mt-6 space-y-4">
              <a href="/submit-work" className="block rounded-xl border border-yellow-400/40 bg-yellow-500/10 p-4 text-yellow-200 hover:bg-yellow-500/15">Submit new work</a>
              <a href="/mint" className="block rounded-xl border border-white/10 bg-slate-950 p-4 hover:border-yellow-400/40 hover:text-yellow-200">Go to mint page</a>
              <a href="/dex" className="block rounded-xl border border-white/10 bg-slate-950 p-4 hover:border-yellow-400/40 hover:text-yellow-200">Browse DEX</a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Your profile</h2>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li><span className="text-slate-500">Username:</span> {user.username}</li>
              <li><span className="text-slate-500">Email:</span> {user.email}</li>
              <li><span className="text-slate-500">Role:</span> {user.role}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
