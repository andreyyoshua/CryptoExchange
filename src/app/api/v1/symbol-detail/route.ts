import SymbolDetail from "@/shared/entities/symbolDetail"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const res = await fetch(`${process.env.BINANCE_BASE_URL}/bapi/composite/v1/public/marketing/tardingPair/detail?symbol=${symbol}`)
    const data = await res.json()

    if (data.data && data.data.length > 0) {
        const symbolDetail = data.data[0]
        return Response.json({
            iconURL: symbolDetail.url,
            name: symbolDetail.symbol,
            alias: symbolDetail.alias,
            symbol: symbolDetail.symbolPair,
            marketCap: symbolDetail.marketCap,
            circulatingSupply: symbolDetail.circulatingSupply,
            historicalHigh: symbolDetail.allTimeHighPriceUsd,
            historicalLow: symbolDetail.allTimeLowPriceUsd,
            historicalHighDate: symbolDetail.allTimeHighDate,
            historicalLowDate: symbolDetail.allTimeLowDate,
            issueDate: symbolDetail.issueDate,
            marketDominanceIndex: symbolDetail.dominance,
            maxSupply: symbolDetail.maxSupply,
            rank: symbolDetail.rank,
            total: symbolDetail.totalSupply,
            description: symbolDetail.details.find((x: any) => x.language == "EN").description
        } as SymbolDetail)
    }
    return Response.error()
    
}