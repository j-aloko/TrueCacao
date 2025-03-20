import React from 'react';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import PropTypes from 'prop-types';

import FooterContainer from './containers/footer-container/FooterContainer';
import NavbarContainer from './containers/navbar-container/NavbarContainer';
import StoreProvider from './StoreProvider';
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
            <Container
              maxWidth="xl"
              disableGutters
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <nav>
                <NavbarContainer />
              </nav>
              <main>
                <StoreProvider>{children}</StoreProvider>
              </main>
              <footer style={{ marginTop: 'auto' }}>
                <FooterContainer />
              </footer>
            </Container>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
