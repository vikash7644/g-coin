import { NavBar } from '@/components/NavBar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function DexPage() {
  const user = await getCurrentUser();

  const assets = await prisma.mintedAsset.findMany({
    include: { owner: true, submission: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">G-COIN DEX</p>
          <h1 className="mt-2 text-4xl font-black">Off-chain trading economy</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <div key={asset.id} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-yellow-300">{asset.rarity}</div>
                  <h2 className="mt-2 text-2xl font-bold">#{asset.editionNumber}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">
                  {asset.isStaked ? 'Staked' : 'Available'}
                </span>
              </div>

              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                <div className="text-sm text-slate-300">Owner</div>
                <div className="mt-1 font-semibold text-white">{asset.owner.username}</div>
                <div className="mt-3 text-sm text-slate-300">Project</div>
                <div className="mt-1 font-medium text-yellow-200">{asset.submission.projectTitle}</div>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
                <span>Mint price</span>
                <span className="font-semibold text-yellow-300">${asset.mintPrice}</span>
              </div>

              <div className="mt-4 flex gap-3">
                {user && user.id !== asset.ownerId ? (
                  <form action="/api/dex/trade" method="POST" className="flex-1">
                    <input type="hidden" name="assetId" value={asset.id} />
                    <input type="hidden" name="price" value={String(asset.mintPrice + 25)} />
                    <button type="submit" className="w-full rounded-xl bg-yellow-400 px-4 py-2 font-semibold text-slate-900 hover:bg-yellow-300">
                      Buy asset
                    </button>
                  </form>
                ) : null}

                {user && user.id === asset.ownerId ? (
                  <form action="/api/stake" method="POST" className="flex-1">
                    <input type="hidden" name="assetId" value={asset.id} />
                    <input type="hidden" name="action" value={asset.isStaked ? 'unstake' : 'stake'} />
                    <button type="submit" className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 font-semibold text-white hover:border-yellow-400/50 hover:text-yellow-200">
                      {asset.isStaked ? 'Unstake' : 'Stake'}
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
