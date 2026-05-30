import { NextResponse } from "next/server";
import { generateInsight } from "@/lib/insights";

function isValidAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function POST(req: Request) {
  try {
    const { contract } = await req.json();

    if (!contract || !isValidAddress(contract)) {
      return NextResponse.json(
        { error: "Invalid contract address" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ALCHEMY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Alchemy API key" },
        { status: 500 }
      );
    }

    const baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}`;

    const metadataRes = await fetch(
      `${baseUrl}/getContractMetadata?contractAddress=${contract}`
    );

    let allOwners: any[] = [];
let pageKey = "";

do {
  const ownersUrl = pageKey
    ? `${baseUrl}/getOwnersForContract?contractAddress=${contract}&withTokenBalances=true&pageKey=${pageKey}`
    : `${baseUrl}/getOwnersForContract?contractAddress=${contract}&withTokenBalances=true`;

  const ownersRes = await fetch(ownersUrl);

  if (!ownersRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch owners data" },
      { status: 500 }
    );
  }

  const ownersData = await ownersRes.json();

  allOwners = [...allOwners, ...(ownersData?.owners || [])];

  pageKey = ownersData?.pageKey || "";
} while (pageKey && allOwners.length < 10000);

    if (!metadataRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch contract metadata" },
        { status: 500 }
      );
    }

    

    const metadata = await metadataRes.json();
   

    const collectionName =
      metadata?.name ||
      metadata?.contractMetadata?.name ||
      metadata?.contract?.name ||
      "Unknown Collection";

    const collectionSymbol =
      metadata?.symbol ||
      metadata?.contractMetadata?.symbol ||
      metadata?.contract?.symbol ||
      "";

    const imageUrl =
      metadata?.image?.cachedUrl ||
      metadata?.openSeaMetadata?.imageUrl ||
      "";

    const externalUrl = metadata?.openSeaMetadata?.externalUrl || "";

    const openSeaUrl = metadata?.openSeaMetadata?.collectionSlug
      ? `https://opensea.io/collection/${metadata.openSeaMetadata.collectionSlug}`
      : "";

    const owners = allOwners;
    const totalHolders = owners.length;

    const balances = owners.map((owner: any) => {
      const tokenBalances = owner.tokenBalances || [];

      const count = tokenBalances.reduce((sum: number, token: any) => {
        return sum + Number(token.balance || 0);
      }, 0);

      return {
        wallet: owner.ownerAddress,
        count,
        xHandle: null,
      };
    });

    balances.sort((a: any, b: any) => b.count - a.count);

    const whales = balances.filter((h: any) => h.count >= 100).length;

    const collectors = balances.filter(
      (h: any) => h.count >= 20 && h.count < 100
    ).length;

    const supporters = balances.filter(
      (h: any) => h.count >= 5 && h.count < 20
    ).length;

    const regularHolders = balances.filter(
      (h: any) => h.count >= 1 && h.count < 5
    ).length;

    const top10 = balances.slice(0, 10);

    const calculatedSupply = balances.reduce(
      (sum: number, holder: any) => sum + holder.count,
      0
    );

    const totalSupply =
  calculatedSupply ||
  Number(metadata?.totalSupply) ||
  Number(metadata?.contractMetadata?.totalSupply) ||
  Number(metadata?.contract?.totalSupply) ||
  0;
    const top10Supply = top10.reduce(
      (sum: number, holder: any) => sum + holder.count,
      0
    );

    const whaleConcentration =
      totalSupply > 0
        ? Number(((top10Supply / totalSupply) * 100).toFixed(2))
        : 0;

    const holderHealth = Math.max(
      1,
      Math.min(
        100,
        Math.round(
          100 - whaleConcentration * 1.2 + Math.min(totalHolders / 50, 20)
        )
      )
    );

    const insight = generateInsight(
      holderHealth,
      totalHolders,
      whaleConcentration
    );

    return NextResponse.json({
      name: collectionName,
      symbol: collectionSymbol,
      imageUrl,
      externalUrl,
      openSeaUrl,
      totalSupply,
      totalHolders,
      whaleConcentration,
      holderHealth,
      grade: insight.grade,
      whaleRisk: insight.whaleRisk,
      holderDistribution: {
        whales,
        collectors,
        supporters,
        holders: regularHolders,
      },
      topHolders: top10,
      aiInsight: insight.message,
    });
  } catch (error) {
    console.error("Analyze API Error:", error);

    return NextResponse.json(
      { error: "Server error while analyzing collection" },
      { status: 500 }
    );
  }
}