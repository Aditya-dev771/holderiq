"use client";

import { useState } from "react";
import CollectionAnalyzer from "@/components/CollectionAnalyzer";
import WalletAnalyzer from "@/components/WalletAnalyzer";
import CollectionCompare from "@/components/CollectionCompare";

export default function AnalyzerTabs() {
  const [activeTab, setActiveTab] = useState<
    "collection" | "wallet" | "compare"
  >("collection");

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <TabButton
          label="Analyze Collection"
          active={activeTab === "collection"}
          onClick={() => setActiveTab("collection")}
        />

        <TabButton
          label="Wallet Analyzer"
          active={activeTab === "wallet"}
          onClick={() => setActiveTab("wallet")}
        />

        <TabButton
          label="Collection Compare"
          active={activeTab === "compare"}
          onClick={() => setActiveTab("compare")}
        />
      </div>

      {activeTab === "collection" && <CollectionAnalyzer />}
      {activeTab === "wallet" && <WalletAnalyzer />}
            {activeTab === "compare" && <CollectionCompare />}
    </section>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-6 py-3 font-semibold transition ${
        active
          ? "bg-white text-black"
          : "border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500"
      }`}
    >
      {label}
    </button>
  );
}