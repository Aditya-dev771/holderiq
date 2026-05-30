export default function Waitlist() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="border border-zinc-800 rounded-3xl p-10 bg-zinc-950 text-center">
        <p className="text-zinc-500 mb-4">Early Access</p>

        <h2 className="text-5xl font-bold">
          Join the first HolderIQ founders.
        </h2>

        <p className="mt-6 text-zinc-400 text-xl max-w-2xl mx-auto">
          Get early access to NFT holder analytics, loyalty scoring,
          AI insights, and founder CRM tools.
        </p>

        <div className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white outline-none focus:border-white"
          />

          <button className="bg-white text-black px-6 py-4 rounded-xl font-semibold hover:bg-zinc-200 transition">
            Join Waitlist
          </button>
        </div>

        <p className="mt-4 text-zinc-600 text-sm">
          Founder access opens first for NFT communities.
        </p>
      </div>
    </section>
  );
}