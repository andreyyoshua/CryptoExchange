import { ExchangeInfoSymbol } from "@/shared/entities/exchangeInfo"
import SymbolDetail from "@/shared/entities/symbolDetail"
import Ticker from "@/shared/entities/ticker"

export interface SymbolState {
    symbol: string
    interval: Interval
    isLoading: boolean
    error?: string
    allKLines: KLine[]
    exchangeInfo?: ExchangeInfoSymbol
    symbolDetail?: SymbolDetail
    kLines: KLine[]
    ticker?: Ticker
    isLastPriceIncreased?: boolean
    asks: DepthData[]
    bids: DepthData[]
}

export type Interval = '1s' | '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M'

export const intervalOptions: Interval[] = ['1s', '1m', '5m', '1d', '3d', '1w']

export interface KLine {
    startTime?: number
    closeTime: number
    symbol: string
    interval?: string
    // firstTradeID?: number
    // lastTradeID?: number
    openPrice: number
    closePrice: number
    highPrice: number
    lowPrice: number
    baseAssetVolume: number
    // noOfTrades: number
    isClosed: boolean
    quoteAssetVolume: number
    // takerBuyAssetVolume: number
    // takerQuoteAssetVolume: number
}

export interface InitializeData {
    symbol: string
    interval: Interval
}

export interface InitializeResponse {
    kLines: KLine[]
    exchangeInfoSymbols: ExchangeInfoSymbol[]
    symbolDetail: SymbolDetail
    symbol: string
    interval: Interval
}

export interface DepthData {
    priceLevel: number
    quantity: number
}