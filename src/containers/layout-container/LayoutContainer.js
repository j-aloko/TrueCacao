import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import PropTypes from 'prop-types';

import FooterContainer from '@/containers/footer-container/FooterContainer';
import NavbarContainer from '@/containers/navbar-container/NavbarContainer';

function LayoutContainer({ children, showNavbar = true, showFooter = true }) {
  return (
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
      {showNavbar && (
        <Box component="nav">
          <NavbarContainer />
        </Box>
      )}

      <Box component="main">{children}</Box>

      {showFooter && (
        <Box component="footer" mt="auto">
          <FooterContainer />
        </Box>
      )}
    </Container>
  );
}

LayoutContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContainer;
