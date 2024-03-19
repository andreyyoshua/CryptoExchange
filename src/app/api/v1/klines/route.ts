import btcusdtKLineHistory from "@/shared/dummyData/btcusdtKLineHistory"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const interval = searchParams.get('interval')
    let data
    try {
        const res = await fetch(`${process.env.BINANCE_API_BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`)
        data = await res.json()
    } catch (error: any) {
        data = btcusdtKLineHistory
    }
    return Response.json(data.map((d: any) => {
        return {
            openTime: d[0],
            openPrice: d[1],
            highPrice: d[2],
            lowPrice: d[3],
            closePrice: d[4],
            baseAssetVolume: d[5],
            closeTime: d[6],
            quoteAssetVolume: d[7],
            noOfTrades: d[8],
            takerBuyBaseAssetVolume: d[9],
            takerBuyQuoteAssetVolume: d[10],

            // Additional var to support client
            isClosed: true,
            interval,
            symbol
        }
    }))
}