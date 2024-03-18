import { ExchangeInfoSymbol } from "@/shared/entities/exchangeInfo"
import Ticker from "@/shared/entities/ticker"

export type HeadCellID = 'name' | 'price' | '24hChange' | '24hVolume' | 'marketCap'
export type OrderAscDesc = 'asc' | 'desc'

export interface HeadCell {
    id: HeadCellID
    label: string
    minWidth: number
    isNumeric: boolean
}

export interface HomeState {
    loading: boolean
    error?: string
    tickers: Ticker[]
    hotCoins: Ticker[]
    topGainers: Ticker[]
    topVolumes: Ticker[]
    orderBy: HeadCellID
    order: OrderAscDesc
    exchangeInfoSymbols?: ExchangeInfoSymbol[]
    headCells: HeadCell[]
}