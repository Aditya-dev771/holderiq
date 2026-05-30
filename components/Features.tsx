export default function Features() {
  const features = [
    {
      title: "Holder Intelligence",
      description:
        "Identify whales, collectors, diamond hands, and flippers instantly."
    },
    {
      title: "Holder Health Score",
      description:
        "One simple score that shows the health of your NFT community."
    },
    {
      title: "AI Insights",
      description:
        "Get actionable recommendations instead of raw charts."
    },
    {
      title: "Community CRM",
      description:
        "Track and reward your most valuable supporters."
    }
  ];

  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-6 py-24"
    >
      <h2 className="text-4xl font-bold mb-12">
        Built for NFT Founders
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="border border-zinc-800 rounded-2xl p-6 hover:border-zinc-500 transition"
          >
            <h3 className="text-xl font-semibold mb-4">
              {feature.title}
            </h3>

            <p className="text-zinc-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}