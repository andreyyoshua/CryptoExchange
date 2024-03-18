import { CaseReducer, PayloadAction, buildCreateSlice, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HeadCell, HomeState, HeadCellID, OrderAscDesc } from "./entities";
import Ticker from "@/shared/entities/ticker";
import { ExchangeInfoSymbol } from "@/shared/entities/exchangeInfo";
import { createAppSlice } from "@/shared/redux/createAppSlice";

const headCells: HeadCell[] = [
    {
        id: 'name',
        label: 'Name',
        minWidth: 200,
        isNumeric: false,
    },
    {
        id: 'price',
        label: 'Price',
        minWidth: 150,
        isNumeric: true,
    },
    {
        id: '24hChange',
        label: '24h Change',
        minWidth: 150,
        isNumeric: true,
    },
    {
        id: '24hVolume',
        label: '24h Volume',
        minWidth: 100,
        isNumeric: true,
    },
    {
        id: 'marketCap',
        label: 'Market Cap',
        minWidth: 100,
        isNumeric: true,
    }
]


const initialState: HomeState = {
    loading: true,
    tickers: [],
    hotCoins: [],
    topGainers: [],
    topVolumes: [],
    orderBy: 'marketCap',
    order: 'desc',
    headCells
}


const sortTickersBy = (tickers: Ticker[], orderBy: HeadCellID, order: OrderAscDesc): Ticker[] => {
    return tickers.sort((a, b) => {
        switch (orderBy) {
        case "name": return order == 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
        case "price": return order == 'desc' ? b.lastPrice - a.lastPrice : a.lastPrice - b.lastPrice
        case "24hChange": return order == 'desc' ? b.priceChange - a.priceChange : a.priceChange - b.priceChange
        case "24hVolume": return order == 'desc' ? b.quoteAssetVolume - a.quoteAssetVolume : a.quoteAssetVolume - b.quoteAssetVolume
        case "marketCap": return order == 'desc' ? b.marketCap - a.marketCap : a.marketCap - b.marketCap
        }
    })
}

const _receiveStream: CaseReducer<HomeState, PayloadAction<string>> = (state, action) => {
    const stream = JSON.parse(action.payload)
    if (stream.stream == "!ticker@arr") {
        const tickers = stream.data
        const tempAllTickers = [...state.tickers]

        for (const ticker of tickers) {

            const exchangeInfo = state.exchangeInfoSymbols?.find((x) => { return x.symbol == ticker.s })
            const newTicker: Ticker = {
                // eventType: ticker.e,
                eventTime: ticker.E,
                symbol: ticker.s,
                name: exchangeInfo?.name ?? "",
                baseAsset: exchangeInfo?.baseAsset ?? "",
                quoteAsset: exchangeInfo?.quoteAsset ?? "",
                marketCap: exchangeInfo?.marketCap ?? 0,
                priceChange: parseFloat(ticker.p),
                priceChangePercentage: parseFloat(ticker.P),
                weightedAveragePrice: parseFloat(ticker.w),
                // firstTradePrice: ticker.x,
                lastPrice: parseFloat(ticker.c),
                // lastQuantity: ticker.Q,
                // bestBidPrice: ticker.b,
                // bestBidQuantity: ticker.B,
                // bestAskPrice: ticker.a,
                // bestAskQuantity: ticker.A,
                openPrice: parseFloat(ticker.o),
                highPrice: parseFloat(ticker.h),
                lowPrice: parseFloat(ticker.l),
                baseAssetVolume: parseFloat(ticker.v),
                quoteAssetVolume: parseFloat(ticker.q),
                openTime: ticker.O,
                closeTime: ticker.C,
                // firstTradeID: ticker.F,
                // lastTradeID: ticker.L,
                // numberOfTrades: ticker.n,
            }
            
            const index = tempAllTickers.findIndex((x) => x.symbol == ticker.s)
            if (index >= 0) {
                const previousTicker = tempAllTickers[index]
                newTicker.isLastPriceIncreased = previousTicker.lastPrice < parseFloat(ticker.c)
                tempAllTickers[index] = newTicker
            } else {
                tempAllTickers.push(newTicker)
            }
        }

        state.tickers = sortTickersBy(tempAllTickers.filter((x) => x.quoteAsset == "USDT").filter(x => x.name != ''), state.orderBy, state.order)
        state.loading = state.exchangeInfoSymbols == null || state.tickers.length == 0
        state.hotCoins = state.tickers.sort((a, b) => b.eventTime - a.eventTime).slice(0, 3)
        state.topGainers = state.tickers.sort((a, b) => b.priceChangePercentage - a.priceChangePercentage).slice(0, 3)
        state.topVolumes = state.tickers.sort((a, b) => b.quoteAssetVolume - a.quoteAssetVolume).slice(0, 3)
    }
}


const homeSlice = createAppSlice({
    name: 'home',
    initialState,
    reducers: create => ({
        initialize: create.asyncThunk(async () => {
            const exchangeInfoRes = await fetch("/api/v1/exchange-info")
            const exchangeInfoSymbols = await exchangeInfoRes.json() as ExchangeInfoSymbol[]
            return exchangeInfoSymbols
        }, {
            pending: state => {
                state.loading = true
            },
            fulfilled: (state, action) => {
                state.exchangeInfoSymbols = action.payload
            },
            rejected: (state, action) => {
                state.loading = false
                state.error = action.error.message
            }
        }),
        changeOrder: create.reducer((state, action: PayloadAction<OrderAscDesc>) => {
            state.order = action.payload
        }),
        changeOrderBy: create.reducer((state, action: PayloadAction<HeadCellID>) => {
            state.orderBy = action.payload
            const isAsc = state.orderBy == action.payload && state.order == 'asc'
            const newOrder: OrderAscDesc = isAsc ? 'desc' : 'asc'
            state.order = newOrder
            state.tickers = sortTickersBy(state.tickers, state.orderBy, newOrder)
        }),
        receiveStream: create.reducer(_receiveStream)
    }),
})

export const { changeOrder, changeOrderBy, receiveStream, initialize } = homeSlice.actions

export default homeSlice