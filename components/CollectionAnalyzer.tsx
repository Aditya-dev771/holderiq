"use client";

import { useState } from "react";

type TopHolder = {
  wallet: string;
  count: number;
};

type AnalysisResult = {
  name: string;
  symbol: string;
  totalSupply: number;
  totalHolders: number;
  whaleConcentration: number;
  holderHealth: number;
  topHolders: TopHolder[];
  aiInsight: string;
};

export default function CollectionAnalyzer() {
  const [contract, setContract] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  function isValidAddress(address: string) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  async function handleAnalyze() {
    setError("");
    setResult(null);

    if (!isValidAddress(contract)) {
      setError("Enter a valid Ethereum contract address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to analyze collection.");
        return;
      }

      setResult(data);
    } catch {
      setError("Something went wrong while analyzing.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950">
        <h2 className="text-4xl font-bold">Analyze Collection</h2>

        <p className="mt-4 text-zinc-400">
          Paste an Ethereum NFT collection contract address and get holder
          intelligence.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <input
            value={contract}
            onChange={(e) => setContract(e.target.value)}
            placeholder="0x collection contract address"
            className="flex-1 bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white outline-none focus:border-white"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-white text-black px-6 py-4 rounded-xl font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {result && (
          <div className="mt-10">
            <div className="mb-8">
              <p className="text-zinc-500 text-sm">Collection</p>
              <h3 className="text-3xl font-bold">
                {result.name}{" "}
                {result.symbol ? (
                  <span className="text-zinc-500 text-xl">
                    ({result.symbol})
                  </span>
                ) : null}
              </h3>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <ResultCard
                label="Holder Health"
                value={`${result.holderHealth}/100`}
              />

              <ResultCard
                label="Total Holders"
                value={result.totalHolders.toLocaleString()}
              />

              <ResultCard
                label="Total Supply"
                value={result.totalSupply.toLocaleString()}
              />

              <ResultCard
                label="Top 10 Concentration"
                value={`${result.whaleConcentration}%`}
              />
            </div>

            <div className="mt-8 border border-zinc-800 rounded-2xl p-6">
              <p className="text-zinc-500 text-sm mb-3">AI Insight</p>
              <p className="text-zinc-300">{result.aiInsight}</p>
            </div>

            <div className="mt-8 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-zinc-800">
                <h4 className="font-semibold">Top Holders</h4>
              </div>

              <div className="divide-y divide-zinc-800">
                {result.topHolders.map((holder, index) => (
                  <div
                    key={holder.wallet}
                    className="grid grid-cols-[60px_1fr_100px] gap-4 p-5 text-sm"
                  >
                    <p className="text-zinc-500">#{index + 1}</p>
                    <p className="font-mono text-zinc-300 break-all">
                      {holder.wallet}
                    </p>
                    <p className="text-right font-semibold">
                      {holder.count}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-500 text-sm">{label}</p>
      <h3 className="text-3xl font-bold mt-3">{value}</h3>
    </div>
  );
}