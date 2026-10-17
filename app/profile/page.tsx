import { redirect } from 'next/navigation';

import { NavBar } from '@/components/NavBar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [assets, submissions, holdings] = await Promise.all([
    prisma.mintedAsset.findMany({ where: { ownerId: user.id }, include: { submission: true }, orderBy: { createdAt: 'desc' } }),
    prisma.submission.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.stake.findMany({ where: { userId: user.id }, include: { asset: true } }),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">Profile</p>
          <h1 className="mt-2 text-4xl font-black">{user.username}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Minted assets</h2>
            <div className="mt-6 space-y-4">
              {assets.length === 0 ? (
                <p className="text-slate-300">No minted assets yet.</p>
              ) : assets.map((asset) => (
                <div key={asset.id} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-yellow-200">{asset.submission.projectTitle}</div>
                    <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-200">{asset.rarity}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-300">Edition #{asset.editionNumber} / 100</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Active stakes</h2>
            <div className="mt-6 space-y-4">
              {holdings.length === 0 ? (
                <p className="text-slate-300">No active stakes.</p>
              ) : holdings.map((stake) => (
                <div key={stake.id} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                  <div className="font-semibold text-white">{stake.asset.submission.projectTitle}</div>
                  <div className="mt-2 text-sm text-slate-300">Amount: ${stake.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">Submission history</h2>
          <div className="mt-6 space-y-4">
            {submissions.length === 0 ? (
              <p className="text-slate-300">No submissions yet.</p>
            ) : submissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950 p-4">
                <div>
                  <div className="font-semibold text-white">{submission.projectTitle}</div>
                  <div className="mt-1 text-sm text-slate-300">{submission.status}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{submission.createdAt.toDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
