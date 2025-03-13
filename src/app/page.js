import React from 'react';

import Container from '@mui/material/Container';

import ProductDetailsContainer from './containers/product-details-container/ProductDetailsContainer';

function Home() {
  return (
    <Container maxWidth="xl" disableGutters>
      <ProductDetailsContainer />
    </Container>
  );
}

export default Home;
