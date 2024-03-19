import exchangeInfo from "@/shared/dummyData/exchangeInfo"
import listingData from "@/shared/dummyData/listings"
import { ExchangeInfoResponse } from "@/shared/entities/exchangeInfo"

export async function GET() {
    let _exchangeInfo: ExchangeInfoResponse

    try {
        const exchangeInfoRes = await fetch(`${process.env.BINANCE_API_BASE_URL}/api/v3/exchangeInfo`)
        _exchangeInfo = await exchangeInfoRes.json() as ExchangeInfoResponse
    } catch {
        _exchangeInfo = exchangeInfo as unknown as ExchangeInfoResponse
    }
    // Uncomment this if we want to get real updated value
    // const listingRes = await fetch(`${COIN_MARKET_CAP_BASE_URL}/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=2533a053-a780-4edb-8091-00968d2f802c`)
    const listing = listingData // await listingRes.json()

    const symbols = exchangeInfo.symbols.map(symbol => {
        return {
            name: listing.data.find(x => x.symbol == symbol.baseAsset)?.name,
            symbol: symbol.symbol,
            baseAsset: symbol.baseAsset,
            quoteAsset: symbol.quoteAsset,
            marketCap: listing.data.find(x => x.symbol == symbol.baseAsset)?.quote.USD.market_cap ?? 0
        }
    }).sort((a, b) => b.marketCap - a.marketCap)
    return Response.json(symbols)
}
