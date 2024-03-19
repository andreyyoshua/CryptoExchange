'use client'
import { InitializeData, intervalOptions } from "@/shared/redux/features/symbol/entities";
import { changeKLineInterval, deinitializeSymbol, initialize } from "@/shared/redux/features/symbol/symbolSlice";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { CircularProgress, Container, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import Divider from '@mui/material/Divider'

import dynamic from "next/dynamic";
import { useEffect } from "react";
import ErrorComponent from "@/shared/components/errorComponent";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

const KLineIntervalToggle = () => {
    const symbol = useAppSelector(state => state.symbol.symbol)
    const interval = useAppSelector(state => state.symbol.interval)
    const dispatch = useAppDispatch()
    return (
        <ToggleButtonGroup
            value={interval}
            exclusive
            onChange={(evt, value) => dispatch(changeKLineInterval({
                symbol,
                interval: value
            } as InitializeData))}
            aria-label="text alignment"
            >
                {intervalOptions.map(intervalOption => (
                    <ToggleButton key={intervalOption} value={intervalOption}>
                        <Typography>{intervalOption.toUpperCase()}</Typography>
                    </ToggleButton>
                ))}
        </ToggleButtonGroup>
    )
}

const KLineChart = () => {
    const theme = useTheme()
    const kLines = useAppSelector(state => state.symbol.kLines)
    const lastPrice = useAppSelector(state => state.symbol.ticker?.lastPrice)

    return (
        <ApexChart
            type="candlestick"
            width={'100%'}
            height={470}
            key={"Chart"}
            id={"Chart"}
            group={"Main Chart"}
            options={{
                chart: {
                    id: 'Chart',
                    group: 'Main Chart',
                    animations: {
                        enabled: false,
                    },
                    type: 'candlestick',
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: true,
                        type: 'xy'
                    },
                    background: 'clear'
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        datetimeUTC: false,
                        formatter: (value, timestamp, opts) => {
                            return opts.dateFormatter(new Date(timestamp ?? 0), "HH:mm:ss")
                        },
                        style: {
                            colors: ['white', 'green']
                        }
                    }
                },
                yaxis: {
                    tooltip: {
                        enabled: true,
                    },
                    opposite: true
                },
                annotations: {
                    yaxis: [
                        {
                            y: kLines.length > 0 ? lastPrice : undefined,
                            label: {
                                borderColor: '#00E396',
                                style: {
                                    color: '#fff',
                                    background: '#00E396'
                                },
                                text: lastPrice?.toLocaleString(undefined, { maximumFractionDigits: 2}) ?? ""
                            },
                            width: '100%'
                        }
                    ]
                },
                theme: {
                    mode: theme.palette.mode
                }
                
            }}
            series={[{
                data: kLines.length < 100 ? [] : kLines.map(kLine => {
                    return {
                        x: new Date(kLine.closeTime),
                        y: [kLine.openPrice, kLine.highPrice, kLine.lowPrice, kLine.closePrice]
                    }
                })
            }]}
        >

        </ApexChart>
    )
}

const Header = () => {
    const ticker = useAppSelector(state => state.symbol.ticker)
    const exchangeInfo = useAppSelector(state => state.symbol.exchangeInfo)
    const alias = useAppSelector(state => state.symbol.symbolDetail?.name)
    const isLastPriceIncreased = useAppSelector(state => state.symbol.isLastPriceIncreased)

    const theme = useTheme()
    const isLightTheme = theme.palette.mode === 'light'

    return (
        <Stack direction="row" spacing={2} sx={{overflow: 'auto'}}>
            <Stack direction="row" spacing={2} sx={{position: 'sticky', left: 0, background: isLightTheme ? 'white' : '#121212'}}>
                <Stack>
                    <Typography variant="h5" fontWeight="bold">{exchangeInfo?.baseAsset}/{exchangeInfo?.quoteAsset}</Typography>
                    <Typography variant="caption">{alias}</Typography>
                </Stack>
                <Divider orientation="vertical"/>
                <Stack>
                    <Typography variant="body1" color={isLastPriceIncreased ? 'green' : 'red'}>{ticker?.lastPrice.toLocaleString(undefined, { maximumFractionDigits: 2})}</Typography>
                    <Typography variant="caption">${ticker?.lastPrice.toLocaleString(undefined, { maximumFractionDigits: 2})}</Typography>
                </Stack>
            </Stack>
            <Stack>
                <Typography variant="caption">24h Change</Typography>
                <Stack direction="row" spacing={2}>
                    <Typography color={(ticker?.priceChange ?? 0) > 0 ? 'green' : 'red'}>{ticker?.priceChange.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
                    <Typography color={(ticker?.priceChangePercentage ?? 0) > 0 ? 'green' : 'red'}>{ticker?.priceChangePercentage ?? 0 > 0 ? "+" : ""}{ticker?.priceChangePercentage.toLocaleString(undefined, { maximumFractionDigits: 2 })}%</Typography>
                </Stack>
            </Stack>
            <Stack>
                <Typography variant="caption">24h High</Typography>
                <Typography>{ticker?.highPrice.toLocaleString(undefined, { maximumFractionDigits: 2})}</Typography>
            </Stack>
            <Stack>
                <Typography variant="caption">24h Low</Typography>
                <Typography>{ticker?.lowPrice.toLocaleString(undefined, { maximumFractionDigits: 2})}</Typography>
            </Stack>
            <Stack>
                <Typography variant="caption">24h Volume({exchangeInfo?.baseAsset})</Typography>
                <Typography>{ticker?.baseAssetVolume.toLocaleString(undefined, { maximumFractionDigits: 2})}</Typography>
            </Stack>
            <Stack>
                <Typography variant="caption">24h Volume({exchangeInfo?.quoteAsset})</Typography>
                <Typography>{ticker?.quoteAssetVolume.toLocaleString(undefined, { maximumFractionDigits: 2})}</Typography>
            </Stack>
        </Stack>
    )
}

const OrderBook = () => {
    const asks = useAppSelector(state => state.symbol.asks)
    const bids = useAppSelector(state => state.symbol.bids)
    return (
        <Stack spacing={1}>
            <Typography variant="h6">Order Book</Typography>
            <TableContainer>
                <Table padding="none" 
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none"
                        }
                    }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><Typography fontWeight="bold">Amount(BTC)</Typography></TableCell>
                            <TableCell align="center"><Typography fontWeight="bold">Bid(USD)</Typography></TableCell>
                            <TableCell align="center"><Typography fontWeight="bold">Ask(USD)</Typography></TableCell>
                            <TableCell align="center"><Typography fontWeight="bold">Amount(BTC)</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    
                    <TableBody>
                        {bids.slice(0, 10).map((bid, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{bid.quantity.toLocaleString(undefined, { maximumFractionDigits: 5 })}</TableCell>
                                <TableCell align="center">{bid.priceLevel.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                                <TableCell align="center">{(asks.length > index ? asks[index].priceLevel : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                                <TableCell align="center">{(asks.length > index ? asks[index].quantity : 0).toLocaleString(undefined, { maximumFractionDigits: 5 })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    )
}

const SymbolDetail = () => {
    const symbolDetail = useAppSelector(state => state.symbol.symbolDetail)
    return (
        <Stack spacing={1}>
            <Typography variant="h6">Info</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Ranking</Typography>
                            <Typography fontWeight="bold">No. {symbolDetail?.rank}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Market Capitalization</Typography>
                            <Typography fontWeight="bold">{symbolDetail?.marketCap?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Market Dominance Index</Typography>
                            <Typography fontWeight="bold">{symbolDetail?.marketDominanceIndex?.toLocaleString(undefined, { maximumFractionDigits: 0 })}%</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Circulating Supply</Typography>
                            <Typography fontWeight="bold">{symbolDetail?.circulatingSupply?.toLocaleString(undefined, { maximumFractionDigits: 0 })} {symbolDetail?.alias}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Maximum Supply</Typography>
                            <Typography fontWeight="bold">{symbolDetail?.maxSupply?.toLocaleString(undefined, { maximumFractionDigits: 0 })} {symbolDetail?.alias}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Total</Typography>
                            <Typography fontWeight="bold">{symbolDetail?.total?.toLocaleString(undefined, { maximumFractionDigits: 0 })} {symbolDetail?.alias}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Issue Date</Typography>
                            <Typography fontWeight="bold">{new Date(symbolDetail?.issueDate ?? 0).toDateString()}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Historical High</Typography>
                            <Stack alignItems="end">
                                <Typography fontWeight="bold">{symbolDetail?.historicalHigh?.toLocaleString(undefined, { maximumFractionDigits: 6 })}</Typography>
                                <Typography variant="caption" fontWeight="bold">{new Date(symbolDetail?.historicalHighDate ?? 0).toDateString()}</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography>Historical Low</Typography>
                            <Stack alignItems="end">
                                <Typography fontWeight="bold">{symbolDetail?.historicalLow?.toLocaleString(undefined, { maximumFractionDigits: 6 })}</Typography>
                                <Typography variant="caption" fontWeight="bold">{new Date(symbolDetail?.historicalLowDate ?? 0).toDateString()}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack>
                        <Typography variant="subtitle1" fontWeight="bold">Intro</Typography>
                        <Typography variant="subtitle2">{symbolDetail?.description}</Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    )
}

export default function SymbolPage({ params }: { params: { symbol: string }}) {
    
    const isLoading = useAppSelector(state => state.symbol.isLoading)
    const error = useAppSelector(state => state.symbol.error)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initialize({
            symbol: params.symbol,
            interval: '1m'
        }))
        return () => {
            dispatch(deinitializeSymbol())
        }
    }, [dispatch, params.symbol])

    if (error) {
        return (<ErrorComponent message={error} />)
    }
    
    if (isLoading) {
        return (
            <Grid container 
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '100vh' }}>
                <CircularProgress/>
            </Grid>
        )
    }
    
    return (
        <Container sx={{paddingTop: 4, paddingBottom:8}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Header />
                </Grid>
                <Grid item xs={12}>
                    <Stack spacing={2}>
                        <Divider/>
                        <KLineIntervalToggle/>
                        <KLineChart/>
                        <Divider/>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Stack spacing={2}>
                        <OrderBook />
                        <Divider/>
                    </Stack>
                </Grid>

                <Grid item xs={12}><SymbolDetail/></Grid>

            </Grid>
        </Container>
    )
}