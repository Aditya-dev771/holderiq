export default function DashboardPreview() {
  const stats = [
    { label: "Holder Health", value: "87/100", note: "Strong community" },
    { label: "Diamond Hands", value: "214", note: "+18 this week" },
    { label: "Whales", value: "16", note: "Healthy spread" },
    { label: "Listed Supply", value: "3.8%", note: "Low pressure" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950">
        <div className="mb-10">
          <p className="text-zinc-500 mb-2">Collection Report</p>
          <h2 className="text-4xl font-bold">Normie Punk</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-zinc-800 rounded-2xl p-6"
            >
              <p className="text-zinc-500 text-sm">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-3">{stat.value}</h3>
              <p className="text-zinc-400 mt-2 text-sm">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-sm mb-3">AI Insight</p>
          <p className="text-zinc-300">
            Holder health is strong. Whale concentration is healthy, listing
            pressure is low, and diamond hand count increased this week.
          </p>
        </div>
      </div>
    </section>
  );
}