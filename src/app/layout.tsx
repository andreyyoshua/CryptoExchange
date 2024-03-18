import type { Metadata } from "next";
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeProviderWrapper from "@/shared/components/themeProviderWrapper";

export const metadata: Metadata = {
  title: "Cryptocurrency Exchange",
  description: "A Pintu Test App",
};

export default function RootLayout(props: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProviderWrapper>
              {props.children}
          </ThemeProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
