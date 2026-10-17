import { redirect } from 'next/navigation';

import { NavBar } from '@/components/NavBar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function AdminVerifyPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  const pendingSubmissions = await prisma.submission.findMany({
    where: { status: 'PENDING' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">Admin panel</p>
          <h1 className="mt-2 text-4xl font-black">Verify submissions</h1>
        </div>

        <div className="space-y-6">
          {pendingSubmissions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-slate-300">No pending submissions right now.</div>
          ) : (
            pendingSubmissions.map((submission) => (
              <div key={submission.id} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.1em] text-yellow-300">{submission.user.username}</div>
                    <h2 className="mt-1 text-2xl font-bold">{submission.projectTitle}</h2>
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{submission.createdAt.toDateString()}</div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="space-y-3 text-slate-300">
                    <p><span className="text-slate-500">Repo:</span> <a href={submission.githubRepoUrl} className="text-yellow-300 underline">{submission.githubRepoUrl}</a></p>
                    <p><span className="text-slate-500">Demo:</span> <a href={submission.liveDemoUrl || '#'} className="text-yellow-300 underline">{submission.liveDemoUrl}</a></p>
                    <p><span className="text-slate-500">Tech:</span> {submission.techStackUsed}</p>
                    <p><span className="text-slate-500">Hash:</span> {submission.workHash}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-white">Description</h3>
                    <p className="whitespace-pre-wrap text-slate-300">{submission.description}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <form action="/api/admin/verify" method="POST" className="flex gap-3">
                    <input type="hidden" name="submissionId" value={submission.id} />
                    <input type="hidden" name="decision" value="APPROVE" />
                    <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-400">Approve</button>
                  </form>

                  <form action="/api/admin/verify" method="POST" className="flex gap-3">
                    <input type="hidden" name="submissionId" value={submission.id} />
                    <input type="hidden" name="decision" value="REJECT" />
                    <input type="text" name="reason" placeholder="Reason for rejection" className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-yellow-400" />
                    <button type="submit" className="rounded-xl bg-rose-500 px-4 py-2 font-semibold text-white hover:bg-rose-400">Reject</button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
