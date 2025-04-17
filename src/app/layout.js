import React, { Suspense } from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import PropTypes from 'prop-types';

import CartDrawerContainer from '@/containers/cart-drawer-container/CartDrawerContainer';
import FooterContainer from '@/containers/footer-container/FooterContainer';
import NavbarContainer from '@/containers/navbar-container/NavbarContainer';
import StoreProvider from '@/provider-components/StoreProvider';
import ToastProvider from '@/provider-components/ToastProvider';

import theme from './theme';

export const metadata = {
  description:
    'Discover the rich taste of premium Ghanaian cocoa with TrueCacao. We offer 100% pure, high-quality raw cacao powder and dark chocolate, sourced from Ghana’s finest cocoa beans. Perfect for baking, beverages, and healthy indulgence. Shop now for the true cacao experience!',
  title:
    'TrueCacao | Premium Ghanaian Cocoa Powder & Dark Chocolate – Pure & Authentic',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <StoreProvider>
              <Container
                maxWidth="xl"
                disableGutters
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  minHeight: '100vh',
                }}
              >
                <nav>
                  <NavbarContainer />
                </nav>
                <main>{children}</main>
                <footer style={{ marginTop: 'auto' }}>
                  <FooterContainer />
                </footer>
              </Container>
              <Suspense fallback={<p>Loading cart...</p>}>
                <CartDrawerContainer />
              </Suspense>
              <ToastProvider />
            </StoreProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
