import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";

export const metadata = {
  title:
    "TrueCacao | Premium Ghanaian Cocoa Powder & Dark Chocolate – Pure & Authentic",
  description:
    "Discover the rich taste of premium Ghanaian cocoa with TrueCacao. We offer 100% pure, high-quality raw cacao powder and dark chocolate, sourced from Ghana’s finest cocoa beans. Perfect for baking, beverages, and healthy indulgence. Shop now for the true cacao experience!",
};

export default function RootLayout(props) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
