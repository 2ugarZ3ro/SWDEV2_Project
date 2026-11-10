"use client";

import { SessionProvider } from "next-auth/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#0f766e" },
    secondary: { main: "#f97316" },
  },
  typography: { fontFamily: "inherit" },
});

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
