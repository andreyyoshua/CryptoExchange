import { Apple, Google } from "@mui/icons-material";
import { Button, Grid, Link, Stack, TextField, Typography } from "@mui/material";

export default function Login() {
    return (
        <Grid container 
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: '100vh' }}>
              <Grid item xs={12} sm={6} md={4} lg={3} padding={2}>
                <Stack spacing={2}>
                    <Typography variant="h3" paddingBottom={1}>Log In</Typography>
                    <TextField label="Email/Phone Number"/>
                    <Link href="/" width='100%'><Button variant="contained" fullWidth>Next</Button></Link>

                    <Stack direction="row">
                        <div style={{borderTop: '1px solid #bbb', marginTop: '10px', marginRight: '16px', flexGrow: 1}}/>
                        <Typography>or</Typography>
                        <div style={{borderTop: '1px solid #bbb', marginTop: '10px', marginLeft: '16px', flexGrow: 1}}/>
                    </Stack>

                    <Link href="/" width='100%'><Button variant="contained" fullWidth startIcon={<Google/>}>Continue with Google</Button></Link>
                    <Link href="/" width='100%'><Button variant="contained" fullWidth startIcon={<Apple/>}>Continue with Apple</Button></Link>
                    
                    <Stack alignItems="start">
                        <Link href="/register"><Button>Create Pintu Account</Button></Link>
                    </Stack>
                </Stack>
              </Grid>
    
          </Grid>
    )
}