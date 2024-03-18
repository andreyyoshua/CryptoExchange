'use client'
import { ErrorOutline } from "@mui/icons-material"
import { Grid, Stack, Typography, Button } from "@mui/material"
import { useRouter } from "next/navigation"

export default function ErrorComponent(props: { message: string }) {
  const router = useRouter()
    return (
        <Grid container 
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: '100vh' }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1}>
                  <ErrorOutline/>
                  <Typography>Oops. Something error happened</Typography>
                </Stack>
                <Typography>{props.message}</Typography>
                <Stack direction="row">
                  <Button onClick={() => router.refresh()}>Retry</Button>
                </Stack>
              </Stack>
    
          </Grid>
      )
}