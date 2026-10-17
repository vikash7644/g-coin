import { redirect } from 'next/navigation';

import { NavBar } from '@/components/NavBar';
import { getCurrentUser } from '@/lib/auth';

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <div className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-glow">
          <h1 className="text-3xl font-black text-white">Create account</h1>
          <p className="mt-2 text-slate-300">Join G-COIN and build your proof-of-real-work profile.</p>

          <form action="/api/auth/register" method="POST" className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Username</label>
              <input type="text" name="username" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="dev_name" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input type="email" name="email" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input type="password" name="password" required className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-yellow-400" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-slate-900 hover:bg-yellow-300">
              Register
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
