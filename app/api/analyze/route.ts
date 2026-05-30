import { NextResponse } from "next/server";

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

    const [metadataRes, ownersRes] = await Promise.all([
      fetch(`${baseUrl}/getContractMetadata?contractAddress=${contract}`),
      fetch(`${baseUrl}/getOwnersForContract?contractAddress=${contract}&withTokenBalances=true`),
    ]);

    if (!metadataRes.ok || !ownersRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch collection data" },
        { status: 500 }
      );
    }

    const metadata = await metadataRes.json();
    const ownersData = await ownersRes.json();

    const owners = ownersData.owners || [];
    const totalHolders = owners.length;

    const balances = owners.map((owner: any) => {
      const tokenBalances = owner.tokenBalances || [];
      const count = tokenBalances.reduce((sum: number, token: any) => {
        return sum + Number(token.balance || 0);
      }, 0);

      return {
        wallet: owner.ownerAddress,
        count,
      };
    });

    balances.sort((a: any, b: any) => b.count - a.count);

    const top10 = balances.slice(0, 10);
    const totalSupply =
      Number(metadata?.contractMetadata?.totalSupply) ||
      balances.reduce((sum: number, holder: any) => sum + holder.count, 0);

    const top10Supply = top10.reduce(
      (sum: number, holder: any) => sum + holder.count,
      0
    );

    const whaleConcentration =
      totalSupply > 0 ? Number(((top10Supply / totalSupply) * 100).toFixed(2)) : 0;

    const holderHealth = Math.max(
      1,
      Math.min(
        100,
        Math.round(
          100 -
            whaleConcentration * 1.2 +
            Math.min(totalHolders / 50, 20)
        )
      )
    );

    return NextResponse.json({
      name: metadata?.contractMetadata?.name || "Unknown Collection",
      symbol: metadata?.contractMetadata?.symbol || "",
      totalSupply,
      totalHolders,
      whaleConcentration,
      holderHealth,
      topHolders: top10,
      aiInsight:
        holderHealth >= 80
          ? "Holder health looks strong. The collection has a healthy holder base and manageable whale concentration."
          : holderHealth >= 60
          ? "Holder health is moderate. Watch whale concentration and holder distribution before making reward decisions."
          : "Holder health is weak. The collection may need stronger retention, rewards, or community activation.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error while analyzing collection" },
      { status: 500 }
    );
  }
}