export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-4xl">
        <div className="inline-flex items-center rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-400">
          Intelligence for NFT Communities
        </div>

        <h1 className="mt-8 text-6xl md:text-8xl font-bold tracking-tight">
          Know your holders.
          <br />
          Grow your community.
        </h1>

        <p className="mt-8 text-xl text-zinc-400 max-w-2xl">
          HolderIQ helps NFT founders understand whales, diamond hands,
          retention, listing pressure, and community health through
          AI-powered analytics.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition">
            Analyze Collection
          </button>

          <button className="border border-zinc-700 px-6 py-3 rounded-xl hover:border-white transition">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
}