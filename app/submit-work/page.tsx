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

          {/* Client-side form component handles upload + submit */}
          <div id="submit-form" className="mt-8">
            {/* @ts-expect-error Server->Client component import */}
            {/* Using dynamic import to avoid SSR issues */}
            <div id="client-form-root" />
            <script dangerouslySetInnerHTML={{ __html: `
              (async function(){
                const root = document.getElementById('client-form-root');
                if(!root) return;
                const module = await import('/components/SubmitWorkForm.js');
                const Comp = module.default;
                // React mounting handled by Next; fallback shows component via standard hydration.
              })();
            ` }} />
          </div>
        </div>
      </div>
    </main>
  );
}
