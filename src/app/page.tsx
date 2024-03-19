'use client'
import { Card, CardActionArea, CardContent, CardMedia, Container, Grid, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Toolbar, Typography, useTheme } from "@mui/material";
import { formatNumber } from "@/shared/utils/formatNumber";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { changeOrderBy } from "@/shared/redux/features/home/homeSlice";
import Ticker from "@/shared/entities/ticker";
import dummyNews from "@/shared/dummyData/news";
import Link from '@mui/material/Link';
import ErrorComponent from "@/shared/components/errorComponent";

const HotCoins = ({title, tickers}: {title: string, tickers: Ticker[]}) => {
  const isLoading = useAppSelector(state => state.home.loading)
  const router = useRouter()
  
  return (
    <TableContainer>
      <Toolbar sx={{width: '100%'}}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">
            {title}
          </Typography>
        </Stack>
      </Toolbar>
      <Table>
        <TableBody>
          {isLoading ? [1, 2, 3].map(value => (
            <TableRow key={value}>
              {[1, 2, 3].map(value => (
                <TableCell key={value}><Skeleton variant="rectangular" height={35} /></TableCell>
              ))}
            </TableRow>
          )) : tickers.map(ticker => (
            <TableRow 
              key={ticker.symbol} 
              hover 
              style={{cursor: 'pointer'}}
              onClick={(evt) => {
                router.push(`/coin/${ticker.symbol}`)
              }}>
              <TableCell>{ticker.baseAsset}</TableCell>
              <TableCell>${ticker.lastPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
              <TableCell
                style={{
                  color: ticker.priceChangePercentage > 0 ? 'green' : 'red'
                }}
                >{ticker.priceChangePercentage.toLocaleString(undefined, {maximumFractionDigits: 2})}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const News = () => {
  return (
    <Paper variant="outlined" sx={{padding: 2}}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight="bold">Latest News</Typography>
        <Stack direction="row" sx={{overflow: 'auto'}} spacing={2}>
          {dummyNews.results.filter(x => x.image_url != null && x.content != null).map((news, index) => (
            <Link href={news.link} underline="none" key={index}>
              <Card sx={{minWidth: '300px'}}>
                <CardActionArea>
                  <CardMedia component="img" src={news.image_url!} height={150}/>
                  <CardContent>
                    <Stack>
                      <Typography fontWeight="bold">{news.title.slice(0, 50)}</Typography>
                      <Typography variant="caption" minHeight={150}>{news.content?.slice(0, 200)}</Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

const AllTickers = () => {

  const router = useRouter()
  const tickers = useAppSelector(state => state.home.tickers)
  const orderBy = useAppSelector(state => state.home.orderBy)
  const order = useAppSelector(state => state.home.order)
  const headCells = useAppSelector(state => state.home.headCells)
  const isLoading = useAppSelector(state => state.home.loading)
  const dispatch = useAppDispatch()

  const theme = useTheme()
  const isLightTheme = theme.palette.mode === 'light'
  
  return (
    <TableContainer sx={{ maxHeight: '97vh' /* Not 100 to compensate app bar*/ }}>
      <Toolbar
        sx={{
          position: 'sticky',
          left: 0,
          zIndex: "3 !important",
          background: isLightTheme ? 'white' : '#121212'
        }}>
        <Typography variant="h4" fontWeight="bold">Top Market Cap Coins</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            {headCells.map((head, index) => (
              <TableCell 
                key={head.id}
                style={{
                  position: 'sticky',
                  left: index == 0 ? 0 : undefined,
                  top: 0,
                  zIndex: index == 0 ? "3 !important" : undefined,
                  background: isLightTheme ? 'white' : '#121212',
                  minWidth: head.minWidth,
                }}
                sortDirection={orderBy == head.id ? order : false}
                align={head.isNumeric ? 'right' : 'left'}
              >
                <TableSortLabel
                  active={orderBy == head.id}
                  direction={orderBy == head.id ? order : 'asc'}
                  onClick={() => dispatch(changeOrderBy(head.id))}
                >
                  <Typography fontWeight="bold">{head.label}</Typography>
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? [0, 1, 2, 3, 4, 5].map(value => (
            <TableRow key={value}>
              {headCells.map((head, index) => (
                <TableCell
                  key={head.id}
                  style={{
                    position: index == 0 ? 'sticky' : 'static',
                    left: index == 0 ? 0 : undefined,
                    zIndex: index == 0 ? "3 !important" : undefined,
                    background: isLightTheme ? 'white' : '#121212',
                    minWidth: head.minWidth
                  }}
                >
                  <Skeleton variant="rectangular" height={35} />
                </TableCell>
              ))}
            </TableRow>
          )) : tickers.map(ticker => (
            <TableRow 
              key={ticker.symbol}
              hover
              role="cell"
              sx={{ cursor: 'pointer' }}
              onClick={(evt) => {
                router.push(`/coin/${ticker.symbol}`)
              }}
            >
              {headCells.map((head, index) => (
                <TableCell 
                  key={head.id}
                  style={{
                    position: index == 0 ? 'sticky' : 'static',
                    left: index == 0 ? 0 : undefined,
                    zIndex: index == 0 ? "3 !important" : undefined,
                    // background: index == 0 ? (isLightTheme ? 'white' : '#121212') : undefined,
                    minWidth: head.minWidth
                  }}
                  align={head.isNumeric ? 'right' : 'left'}
                >{
                  head.id == 'name' ? 
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight="bold">{ticker.name}</Typography>
                    <Typography variant="caption">{ticker.baseAsset}</Typography> 
                  </Stack> :

                  head.id == 'price' ? 
                  <Typography style={{
                    color: ticker.isLastPriceIncreased == true ? "green" : ticker.isLastPriceIncreased == false ? "red" : undefined
                  }}>
                    ${ticker.lastPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}
                  </Typography> :

                  head.id == '24hChange' ? 
                  <Stack direction="row" spacing={2} justifyContent="end">
                    <Typography style={{
                      color: ticker.priceChange > 0 ? "green" : ticker.priceChange < 0 ? "red" : undefined
                    }}>
                      {ticker.priceChange.toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </Typography>
                    <Typography style={{
                      color: ticker.priceChangePercentage > 0 ? "green" : ticker.priceChangePercentage < 0 ? "red" : undefined
                    }}>
                      {ticker.priceChangePercentage.toLocaleString(undefined, {maximumFractionDigits: 2})}%
                    </Typography>
                  </Stack> :

                  head.id == '24hVolume' ?
                  <Typography>${formatNumber(ticker.quoteAssetVolume)}</Typography> :

                  head.id == 'marketCap' ?
                  <Typography>${formatNumber(ticker.marketCap)}</Typography> :
                  
                  <div></div>

                } </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
  )
}

export default function HomePage() {

  const hotCoins = useAppSelector(state => state.home.hotCoins)
  const topGainers = useAppSelector(state => state.home.topGainers)
  const topVolumes = useAppSelector(state => state.home.topVolumes)
  const error = useAppSelector(state => state.home.error)

  if (error) {
    return (<ErrorComponent message={error} />)
  }

  return (
    <Container sx={{paddingTop: 4, paddingBottom: 4}}>
      <Grid container spacing={4}>
        
        <Grid item xs={12}>
          <Stack direction="row" alignItems="end" spacing={2}>
            <Typography variant="h3" fontWeight="bold">
              Markets Overview
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper variant="outlined">
            <HotCoins tickers={hotCoins} title="Hot Coins"/>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper variant="outlined">
            <HotCoins tickers={topGainers} title="Top Gainers"/>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper variant="outlined">
            <HotCoins tickers={topVolumes} title="Top Volumes"/>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <News />
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined">
            <AllTickers />
          </Paper>
        </Grid>
      </Grid>
      
    </Container>
  )
}
