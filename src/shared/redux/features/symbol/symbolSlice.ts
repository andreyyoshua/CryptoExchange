import { ExchangeInfoSymbol } from "@/shared/entities/exchangeInfo";
import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "@/shared/redux/createAppSlice";
import { SymbolState, KLine, InitializeResponse, DepthData, InitializeData, Interval } from "./entities";
import SymbolDetail from "@/shared/entities/symbolDetail";


const initialState: SymbolState = {
    symbol: '',
    interval: '1m',
    allKLines: [],
    exchangeInfo: undefined,
    ticker: undefined,
    isLastPriceIncreased: undefined,
    symbolDetail: undefined,
    kLines: [],
    asks: [],
    bids: [],
    isLoading: true
}

function groupCandlesticksToMinuteIntervals(candlesticks: KLine[]): KLine[] {
    const groupedCandlesticks: KLine[] = [];
    let currentMinute: number = candlesticks.length > 0 ? candlesticks[0].closeTime : 0;
    let minuteCandlestick: KLine | null = candlesticks.length > 0 ? {
        ...candlesticks[0],
        closeTime: currentMinute,
        openPrice: candlesticks[0].openPrice,
        highPrice: candlesticks[0].highPrice,
        lowPrice: candlesticks[0].lowPrice,
        closePrice: candlesticks[0].closePrice,
    } : null;

    for (const candlestick of candlesticks) {

        if (candlestick.closeTime < currentMinute + 60000) {
            // Update minute candlestick with new data
            if (minuteCandlestick) {
                minuteCandlestick.highPrice = Math.max(minuteCandlestick?.highPrice ?? 0, candlestick.highPrice);
                minuteCandlestick.lowPrice = Math.min(minuteCandlestick?.lowPrice ?? 0, candlestick.lowPrice);
                minuteCandlestick.closePrice = candlestick.closePrice;
                // minuteCandlestick.volume += candlestick.volume;
            }
        } else {
            // Push the previous minute candlestick if it exists
            if (minuteCandlestick) {
                groupedCandlesticks.push(minuteCandlestick);
            }

            currentMinute += 60000
            // Initialize new minute candlestick
            minuteCandlestick = {
                ...candlestick,
                closeTime: currentMinute,
                openPrice: candlestick.openPrice,
                highPrice: candlestick.highPrice,
                lowPrice: candlestick.lowPrice,
                closePrice: candlestick.closePrice,
            };
        }
    }

    // Push the last minute candlestick if it exists
    if (minuteCandlestick) {
        groupedCandlesticks.push(minuteCandlestick);
    }

    return groupedCandlesticks;
}

const _receiveStream: CaseReducer<SymbolState, PayloadAction<string>> = (state, action) => {
    const stream = JSON.parse(action.payload)
    if (stream.stream == `${state.symbol.toLowerCase()}@kline_1m`) {
        const kLine: KLine = {
            startTime: stream.data.k.tags,
            closeTime: stream.data.k.T,
            symbol: stream.data.k.s,
            interval: stream.data.k.i,
            // firstTradeID: parseFloat(stream.data.k.f),
            // lastTradeID: parseFloat(stream.data.k.L),
            openPrice: parseFloat(stream.data.k.o),
            closePrice: parseFloat(stream.data.k.c),
            highPrice: parseFloat(stream.data.k.h),
            lowPrice: parseFloat(stream.data.k.l),
            baseAssetVolume: parseFloat(stream.data.k.v),
            // noOfTrades: parseFloat(stream.data.k.n),
            isClosed: stream.data.k.x,
            quoteAssetVolume: parseFloat(stream.data.k.q),
            // takerBuyAssetVolume: parseFloat(stream.data.k.V),
            // takerQuoteAssetVolume: parseFloat(stream.data.k.Q)
        }
        state.allKLines.push(kLine)

        state.kLines = state.allKLines // groupCandlesticksToMinuteIntervals(state.allKLines)
    } else if (stream.stream == `${state.symbol.toLowerCase()}@ticker`) {
        const ticker = stream.data
        const prevTicker = state.ticker
        state.isLastPriceIncreased = (prevTicker?.lastPrice ?? 0) > parseFloat(ticker.c)
        state.ticker = {
            // eventType: ticker.e,
            eventTime: ticker.E,
            symbol: ticker.s,
            name: state.exchangeInfo?.name ?? "",
            baseAsset: state.exchangeInfo?.baseAsset ?? "",
            quoteAsset: state.exchangeInfo?.quoteAsset ?? "",
            marketCap: state.exchangeInfo?.marketCap ?? 0,
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
    } else if (stream.stream == `${state.symbol.toLowerCase()}@depth`) {


        const generateDepthData = (data: any): DepthData[] => (data.map((x: any) => ({
            priceLevel: parseFloat(x[0]),
            quantity: parseFloat(x[1])
        })))

        const bids = generateDepthData(stream.data.b)
        for (const bid of bids) {
            const index = state.bids.findIndex(x => x.priceLevel == bid.priceLevel)
            if (index >= 0) {
                state.bids[index].quantity = bid.quantity
            } else {
                state.bids.push(bid)
                state.bids = state.bids.sort((a, b) => b.priceLevel - a.priceLevel).filter(x => x.quantity > 0)
            }
        }

        const asks = generateDepthData(stream.data.a)
        for (const ask of asks) {
            const index = state.asks.findIndex(x => x.priceLevel == ask.priceLevel)
            if (index >= 0) {
                state.asks[index].quantity = ask.quantity
            } else {
                state.asks.push(ask)
                state.asks = state.asks.sort((a, b) => a.priceLevel - b.priceLevel).filter(x => x.quantity > 0)
            }
        }
    }
}
const symbolSlice = createAppSlice({
    name: 'symbol',
    initialState,
    reducers: create => ({
        initialize: create.asyncThunk(async (params: InitializeData) => {
            const kLinesResponse = await fetch(`/api/v1/klines?symbol=${params.symbol}&interval=${params.interval}`)
            const kLines = await kLinesResponse.json() as KLine[]
            const exchangeInfoRes = await fetch("/api/v1/exchange-info")
            const exchangeInfoSymbols = await exchangeInfoRes.json() as ExchangeInfoSymbol[]
            const exchangeInfo = exchangeInfoSymbols.find(x => x.symbol == params.symbol)

            const symbolDetailRes = await fetch(`/api/v1/symbol-detail?symbol=${exchangeInfo?.baseAsset.toLowerCase()}`)
            const symbolDetail = await symbolDetailRes.json() as SymbolDetail
            const response: InitializeResponse = {
                kLines,
                exchangeInfoSymbols,
                symbolDetail,
                symbol: params.symbol,
                interval: params.interval
            }
            return response
        }, {
            pending: state => {
                state.isLoading = true
            },
            fulfilled: (state, action) => {
                state.symbol = action.payload.symbol
                state.interval = action.payload.interval
                state.isLoading = false
                state.allKLines = action.payload.kLines
                state.kLines = action.payload.kLines
                state.exchangeInfo = action.payload.exchangeInfoSymbols.find(x => x.symbol == state.symbol)
                state.symbolDetail = action.payload.symbolDetail
            },
            rejected: (state, payload) => {
                state.error = payload.error.message
                state.isLoading = false
            }
        }),
        deinitializeSymbol: create.reducer(state => {
            state.kLines = []
            state.allKLines = []
            state.exchangeInfo = undefined
            state.ticker = undefined
            state.isLastPriceIncreased = undefined
            state.symbolDetail = undefined
            state.asks = []
            state.bids = []
        }),
        receiveSymbolStream: create.reducer(_receiveStream),
        changeKLineInterval: create.asyncThunk(async (params: InitializeData) => {
            const kLinesResponse = await fetch(`/api/v1/klines?symbol=${params.symbol}&interval=${params.interval}`)
            const kLines = await kLinesResponse.json() as KLine[]

            return {
                kLines,
                interval: params.interval
            }
        }, {
            pending: state => { },
            fulfilled: (state, action) => {
                state.interval = action.payload.interval
                state.allKLines = action.payload.kLines
                state.kLines = action.payload.kLines
            },
            rejected: (state, payload) => {
                state.error = payload.error.message
                state.isLoading = false
            }
        })
    })
})

export const { initialize, deinitializeSymbol, receiveSymbolStream, changeKLineInterval } = symbolSlice.actions

export default symbolSlice