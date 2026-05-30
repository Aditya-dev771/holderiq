"use client";

import { useState } from "react";

type TopCollection = {
  name: string;
  count: number;
};

type WalletResult = {
  wallet: string;
  totalNfts: number;
  totalCollections: number;
  whaleScore: number;
  diamondScore: number;
  walletType: string;
  topCollections: TopCollection[];
};

export default function WalletAnalyzer() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WalletResult | null>(null);
  const [error, setError] = useState("");

  function isValidAddress(address: string) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  async function handleAnalyze() {
    setError("");
    setResult(null);

    if (!isValidAddress(wallet)) {
      setError("Enter a valid Ethereum wallet address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to analyze wallet.");
        return;
      }

      setResult(data);
    } catch {
      setError("Something went wrong while analyzing wallet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950">
        <h2 className="text-4xl font-bold">Analyze Wallet</h2>

        <p className="mt-4 text-zinc-400">
          Paste an Ethereum wallet address and get NFT portfolio intelligence.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x wallet address"
            className="flex-1 bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white outline-none focus:border-white"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-white text-black px-6 py-4 rounded-xl font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Wallet"}
          </button>
        </div>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {result && (
          <div className="mt-10">
            <div className="mb-8">
              <p className="text-zinc-500 text-sm">Wallet</p>

              <a
                href={`https://etherscan.io/address/${result.wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-400 hover:text-blue-300 break-all"
              >
                {result.wallet}
              </a>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              <ResultCard label="Wallet Type" value={result.walletType} />

              <ResultCard
                label="NFTs Owned"
                value={result.totalNfts.toLocaleString()}
              />

              <ResultCard
                label="Collections"
                value={result.totalCollections.toLocaleString()}
              />

              <ResultCard
                label="Whale Score"
                value={`${result.whaleScore}/100`}
              />

              <ResultCard
                label="Diamond Score"
                value={`${result.diamondScore}/100`}
              />
            </div>

            <div className="mt-8 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-zinc-800">
                <h4 className="font-semibold">Top Collections</h4>
              </div>

              <div className="divide-y divide-zinc-800">
                {result.topCollections.map((collection, index) => (
                  <div
                    key={`${collection.name}-${index}`}
                    className="grid grid-cols-[60px_1fr_100px] gap-4 p-5 text-sm"
                  >
                    <p className="text-zinc-500">#{index + 1}</p>

                    <p className="text-zinc-300 break-all">
                      {collection.name}
                    </p>

                    <p className="text-right font-semibold">
                      {collection.count}
                    </p>
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