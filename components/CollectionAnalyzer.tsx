"use client";

import { useState } from "react";

type TopHolder = {
  wallet: string;
  count: number;
  xHandle?: string | null;
};

type AnalysisResult = {
  name: string;
  symbol: string;
  imageUrl: string;
  externalUrl: string;
  openSeaUrl: string;
  totalSupply: number;
  totalHolders: number;
  whaleConcentration: number;
  holderHealth: number;
  grade: string;
  whaleRisk: string;
  holderDistribution: {
    whales: number;
    collectors: number;
    supporters: number;
    holders: number;
  };
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

  function copyShareReport() {
    if (!result) return;

    const text = `HolderIQ Report

${result.name}

Holder Health: ${result.holderHealth}/100
Grade: ${result.grade}
Whale Risk: ${result.whaleRisk}
Total Holders: ${result.totalHolders.toLocaleString()}
Top 10 Concentration: ${result.whaleConcentration}%

Analyzed by @HolderIQ`;

    navigator.clipboard.writeText(text);
  }

  return (
    <div>
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
            <div className="mb-8 flex items-center gap-4">
              {result.imageUrl && (
                <img
                  src={result.imageUrl}
                  alt={result.name}
                  className="h-16 w-16 rounded-2xl border border-zinc-800 object-cover"
                />
              )}

              <div>
                <p className="text-zinc-500 text-sm">Collection</p>

                <h3 className="text-3xl font-bold">
                  {result.name}
                  {result.symbol && (
                    <span className="text-zinc-500 text-xl ml-2">
                      ({result.symbol})
                    </span>
                  )}
                </h3>

                <div className="mt-2 flex gap-4 text-sm">
                  {result.openSeaUrl && (
                    <a
                      href={result.openSeaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      OpenSea
                    </a>
                  )}

                  {result.externalUrl && (
                    <a
                      href={result.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              <ResultCard
                label="Holder Health"
                value={`${result.holderHealth}/100`}
              />

              <ResultCard label="HolderIQ Grade" value={result.grade} />

              <ResultCard label="Whale Risk" value={result.whaleRisk} />

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

            <button
              onClick={copyShareReport}
              className="mt-4 bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
            >
              Copy Share Report
            </button>

            <div className="mt-8 border border-zinc-800 rounded-2xl p-6">
              <h4 className="font-semibold mb-5">Holder Distribution</h4>

              <div className="grid md:grid-cols-4 gap-4">
                <ResultCard
                  label="Whales"
                  value={result.holderDistribution.whales.toString()}
                />

                <ResultCard
                  label="Collectors"
                  value={result.holderDistribution.collectors.toString()}
                />

                <ResultCard
                  label="Supporters"
                  value={result.holderDistribution.supporters.toString()}
                />

                <ResultCard
                  label="Holders"
                  value={result.holderDistribution.holders.toString()}
                />
              </div>
            </div>

            <div className="mt-8 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-zinc-800">
                <h4 className="font-semibold">Top Holders</h4>
              </div>

              <div className="divide-y divide-zinc-800">
                {result.topHolders.map((holder, index) => (
                  <div
                    key={holder.wallet}
                    className="grid grid-cols-[60px_1fr_140px_120px_100px] gap-4 p-5 text-sm"
                  >
                    <p className="text-zinc-500">#{index + 1}</p>

                    <p className="font-mono text-zinc-300 break-all">
                      {holder.wallet}
                    </p>

                    <div>
                      {holder.xHandle ? (
                        <a
                          href={`https://x.com/${holder.xHandle.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {holder.xHandle}
                        </a>
                      ) : (
                        <span className="text-zinc-600">Not connected</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`https://etherscan.io/address/${holder.wallet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </a>

                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(holder.wallet)
                        }
                        className="text-xs text-zinc-500 hover:text-white"
                      >
                        Copy
                      </button>
                    </div>

                    <p className="text-right font-semibold">{holder.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-500 text-sm">{label}</p>
      <h3 className="text-3xl font-bold mt-3">{value}</h3>
    </div>
  );
}