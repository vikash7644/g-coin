import Link from 'next/link';

export function NavBar() {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold text-white">
          <span className="rounded-full border border-yellow-400/50 bg-yellow-500/15 px-2 py-1 text-xs font-black uppercase text-yellow-300">
            G
          </span>
          <span>G-COIN</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/submit-work">Submit Work</Link>
          <Link href="/mint">Mint</Link>
          <Link href="/dex">DEX</Link>
          <Link href="/admin/verify">Admin Verify</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded border border-white/20 px-3 py-2 text-sm text-white hover:border-yellow-400/60 hover:text-yellow-300">
            Login
          </Link>
          <Link href="/register" className="rounded bg-yellow-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-300">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
