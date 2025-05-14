import React from 'react';

import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpaIcon from '@mui/icons-material/Spa';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import HeroContainer from '@/containers/hero-container/HeroContainer';
import ProductCardsContainer from '@/containers/product-cards-container/ProductCardsContainer';
import ValuePropositionCardContainer from '@/containers/value-proposition-card-container/ValuePropositionCardContainer';
import prisma from '@/lib/prisma';

const features = [
  {
    description:
      'Indulge in premium organic cocoa, expertly crafted by GoldenTree using ethically sourced cocoa beans from organic farms in Ghana, West Africa. ISO-certified for superior quality and rich, authentic flavor.',
    icon: <SpaIcon sx={{ height: '50px', width: '50px' }} color="secondary" />,
    title: 'Organic & Sustainable',
  },
  {
    description:
      'Packed with powerful antioxidants and heart-healthy flavonoids, our cocoa supports cardiovascular wellness while delivering rich, indulgent flavor in every bite.',
    icon: (
      <FavoriteIcon sx={{ height: '50px', width: '50px' }} color="secondary" />
    ),
    title: 'Health Benefits',
  },
  {
    description:
      'Enjoy fast and reliable delivery!, ensuring your premium cocoa products arrive fresh within 2-3 business days.',
    icon: (
      <LocalShippingIcon
        sx={{ height: '50px', width: '50px' }}
        color="secondary"
      />
    ),
    title: 'Fast Shipping',
  },
];

async function Home() {
  const products = await prisma.product.findMany({
    select: {
      descriptionSummary: true,
      id: true,
      images: true,
      name: true,
      slug: true,
      tag: true,
    },
  });
  return (
    <Container maxWidth="xl" disableGutters>
      <Stack spacing={3}>
        <HeroContainer />
        <ProductCardsContainer products={products} />
        <ValuePropositionCardContainer features={features} />
      </Stack>
    </Container>
  );
}

export default Home;
