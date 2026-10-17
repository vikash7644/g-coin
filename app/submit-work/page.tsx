import { redirect } from 'next/navigation';

import { NavBar } from '@/components/NavBar';
import { getCurrentUser } from '@/lib/auth';

export default async function SubmitWorkPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">G-COIN proof of work</p>
          <h1 className="mt-3 text-4xl font-black">Submit work</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Build a real software project, add public proof, and let the admin verify it before minting a G-COIN asset.
          </p>

          <form action="/api/submissions" method="POST" className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Project title</label>
              <input name="projectTitle" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="Example: G-COIN Dashboard" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Description (500 words max)</label>
              <textarea name="description" rows={6} required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="Explain what was built, why it matters, and how it works." />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">GitHub repository URL</label>
              <input name="githubRepoUrl" type="url" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="https://github.com/your/repo" />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Live demo URL</label>
              <input name="liveDemoUrl" type="url" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="https://your-app.vercel.app" />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Tech stack used</label>
              <input name="techStackUsed" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="Next.js, Tailwind, Prisma" />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Video demo URL (optional)</label>
              <input name="videoDemoUrl" type="url" className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="https://youtube.com/..." />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Screenshots (3 URLs, one per line)</label>
              <textarea name="screenshots" rows={5} required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="https://image1.com
https://image2.com
https://image3.com" />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-slate-900 hover:bg-yellow-300">
                Submit for verification
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
