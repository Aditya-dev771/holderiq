"use client";

import { useState } from "react";

type CollectionResult = {
  name: string;
  holderHealth: number;
  grade: string;
  whaleRisk: string;
  totalHolders: number;
  totalSupply: number;
  whaleConcentration: number;
};

export default function CollectionCompare() {
  const [contractA, setContractA] = useState("");
  const [contractB, setContractB] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultA, setResultA] = useState<CollectionResult | null>(null);
  const [resultB, setResultB] = useState<CollectionResult | null>(null);
  const [error, setError] = useState("");

  function isValidAddress(address: string) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  async function handleCompare() {
    setError("");
    setResultA(null);
    setResultB(null);

    if (
      !isValidAddress(contractA) ||
      !isValidAddress(contractB)
    ) {
      setError("Enter two valid contract addresses.");
      return;
    }

    try {
      setLoading(true);

      const [aRes, bRes] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contract: contractA }),
        }),
        fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contract: contractB }),
        }),
      ]);

      const aData = await aRes.json();
      const bData = await bRes.json();

      if (!aRes.ok || !bRes.ok) {
        setError("Failed to compare collections.");
        return;
      }

      setResultA(aData);
      setResultB(bData);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const winner =
    resultA && resultB
      ? resultA.holderHealth > resultB.holderHealth
        ? resultA.name
        : resultB.name
      : null;

  return (
    <div>
      <div className="border border-zinc-800 rounded-3xl p-8 bg-zinc-950">
        <h2 className="text-4xl font-bold">
          Collection Compare
        </h2>

        <p className="mt-4 text-zinc-400">
          Compare two NFT communities side by side.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <input
            value={contractA}
            onChange={(e) =>
              setContractA(e.target.value)
            }
            placeholder="Collection A Contract"
            className="bg-black border border-zinc-800 rounded-xl px-5 py-4"
          />

          <input
            value={contractB}
            onChange={(e) =>
              setContractB(e.target.value)
            }
            placeholder="Collection B Contract"
            className="bg-black border border-zinc-800 rounded-xl px-5 py-4"
          />
        </div>

        <button
          onClick={handleCompare}
          disabled={loading}
          className="mt-4 bg-white text-black px-6 py-4 rounded-xl font-semibold"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>

        {error && (
          <p className="mt-4 text-red-400">
            {error}
          </p>
        )}

        {resultA && resultB && (
          <>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full border border-zinc-800">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4">
                      Metric
                    </th>
                    <th className="text-left p-4">
                      {resultA.name}
                    </th>
                    <th className="text-left p-4">
                      {resultB.name}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-zinc-800">
                    <td className="p-4">
                      Holder Health
                    </td>
                    <td className="p-4">
                      {resultA.holderHealth}
                    </td>
                    <td className="p-4">
                      {resultB.holderHealth}
                    </td>
                  </tr>

                  <tr className="border-b border-zinc-800">
                    <td className="p-4">Grade</td>
                    <td className="p-4">
                      {resultA.grade}
                    </td>
                    <td className="p-4">
                      {resultB.grade}
                    </td>
                  </tr>

                  <tr className="border-b border-zinc-800">
                    <td className="p-4">
                      Whale Risk
                    </td>
                    <td className="p-4">
                      {resultA.whaleRisk}
                    </td>
                    <td className="p-4">
                      {resultB.whaleRisk}
                    </td>
                  </tr>

                  <tr className="border-b border-zinc-800">
                    <td className="p-4">
                      Holders
                    </td>
                    <td className="p-4">
                      {resultA.totalHolders}
                    </td>
                    <td className="p-4">
                      {resultB.totalHolders}
                    </td>
                  </tr>

                  <tr className="border-b border-zinc-800">
                    <td className="p-4">
                      Supply
                    </td>
                    <td className="p-4">
                      {resultA.totalSupply}
                    </td>
                    <td className="p-4">
                      {resultB.totalSupply}
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4">
                      Top 10 Concentration
                    </td>
                    <td className="p-4">
                      {resultA.whaleConcentration}%
                    </td>
                    <td className="p-4">
                      {resultB.whaleConcentration}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 border border-zinc-800 rounded-2xl p-6">
              <p className="text-zinc-500 text-sm">
                Winner
              </p>

              <h3 className="text-3xl font-bold mt-2">
                🏆 {winner}
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}