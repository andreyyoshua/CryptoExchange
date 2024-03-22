'use client'
import StoreProvider from "@/app/storeProvider";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Box, Toolbar, Stack } from "@mui/material";
import { useState } from "react";
import { darkTheme, lightTheme } from "@/theme";
import { AppBar, Button, IconButton, Typography } from "@mui/material"
import { LightMode } from "@mui/icons-material"
import { useRouter } from "next/navigation";

export default function ThemeProviderWrapper(props: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(true);
  
    const toggleTheme = () => {
      setIsDarkMode(prevMode => !prevMode);
    };
  
    const theme = isDarkMode ? darkTheme : lightTheme
    const navItems = ['Home', 'Log In', 'Sign Up']

    const router = useRouter()

    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <StoreProvider>
                <AppBar component="nav" elevation={0}>
                    <Toolbar sx={{zIndex: '9999 !important'}}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1}}>
                            Crypto Exchange
                        </Typography>
                        <Box>
                            {navItems.map((item) => (
                                <Button key={item} sx={{ color: '#fff' }} onClick={() => {
                                    switch (item) {
                                        case 'Home':
                                            router.push('/')
                                            break
                                        case 'Log In':
                                            router.push('/login')
                                            break
                                        case 'Sign Up':
                                            router.push('/register')
                                            break
                                    }
                                }}>
                                {item}
                                </Button>
                            ))}
                            <IconButton onClick={toggleTheme}>
                                <LightMode/>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Stack paddingBottom={4}>
                    <Box component="main">
                        <Toolbar/>
                        {props.children}
                    </Box>
                    <Box textAlign="center">
                        <Typography fontWeight="bold" variant="caption">Copyright @Andrey Yoshua</Typography>
                    </Box>
                </Stack>
            </StoreProvider>
        </ThemeProvider>
    );
  }
  