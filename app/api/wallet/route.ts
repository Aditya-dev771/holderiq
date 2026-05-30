import { NextResponse } from "next/server";

function isValidAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();

    if (!wallet || !isValidAddress(wallet)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
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

    const nftRes = await fetch(
      `${baseUrl}/getNFTsForOwner?owner=${wallet}&withMetadata=true&pageSize=100`
    );

    if (!nftRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch wallet NFTs" },
        { status: 500 }
      );
    }

    const nftData = await nftRes.json();
    const ownedNfts = nftData?.ownedNfts || [];

    const collectionsMap = new Map<string, number>();

    ownedNfts.forEach((nft: any) => {
      const name =
        nft?.contract?.name ||
        nft?.collection?.name ||
        nft?.contract?.address ||
        "Unknown Collection";

      collectionsMap.set(name, (collectionsMap.get(name) || 0) + 1);
    });

    const topCollections = Array.from(collectionsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const totalNfts = ownedNfts.length;
    const totalCollections = collectionsMap.size;

    const whaleScore = Math.min(
      100,
      Math.round(totalNfts * 0.5 + totalCollections * 2)
    );

    const diamondScore = Math.min(
      100,
      Math.round(totalCollections * 3 + totalNfts * 0.25)
    );

    const walletType =
      whaleScore >= 80
        ? "Mega Whale"
        : whaleScore >= 50
        ? "Whale"
        : whaleScore >= 25
        ? "Collector"
        : "Holder";

    return NextResponse.json({
      wallet,
      totalNfts,
      totalCollections,
      whaleScore,
      diamondScore,
      walletType,
      topCollections,
    });
  } catch (error) {
    console.error("Wallet API Error:", error);

    return NextResponse.json(
      { error: "Server error while analyzing wallet" },
      { status: 500 }
    );
  }
}