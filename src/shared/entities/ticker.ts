export default interface Ticker {
    // eventType: string
    eventTime: number
    symbol: string
    name: string
    baseAsset: string
    quoteAsset: string
    marketCap: number
    priceChange: number
    priceChangePercentage: number
    weightedAveragePrice: number
    // firstTradePrice: string
    lastPrice: number
    // lastQuantity: string
    // bestBidPrice: string
    // bestBidQuantity: string
    // bestAskPrice: string
    // bestAskQuantity: string
    openPrice: number
    highPrice: number
    lowPrice: number
    baseAssetVolume: number
    quoteAssetVolume: number
    openTime: number
    closeTime: number
    // firstTradeID: number
    // lastTradeID: number
    // numberOfTrades: number

    isLastPriceIncreased?: boolean
}