export interface ExchangeInfoResponse {
    symbols: ExchangeInfoSymbol[]
}

export interface ExchangeInfoSymbol {
    name: string
    symbol: string
    baseAsset: string
    quoteAsset: string
    marketCap: number
}