export default function WhyHolderIQ() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold">
          NFT founders are flying blind.
        </h2>

        <p className="mt-6 text-zinc-400 text-xl">
          Most founders don't know who their best holders are, who is selling,
          who is accumulating, or when community health is declining.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-16">
        <div className="border border-red-900 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-red-400">
            Without HolderIQ
          </h3>

          <ul className="mt-6 space-y-4 text-zinc-400">
            <li>❌ No holder insights</li>
            <li>❌ No whale tracking</li>
            <li>❌ No loyalty scoring</li>
            <li>❌ No community health monitoring</li>
            <li>❌ Guessing what to do next</li>
          </ul>
        </div>

        <div className="border border-green-900 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-green-400">
            With HolderIQ
          </h3>

          <ul className="mt-6 space-y-4 text-zinc-300">
            <li>✓ Track top holders</li>
            <li>✓ Monitor whale activity</li>
            <li>✓ Reward loyal supporters</li>
            <li>✓ AI powered recommendations</li>
            <li>✓ Grow stronger communities</li>
          </ul>
        </div>
      </div>
    </section>
  );
}