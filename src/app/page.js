import React from 'react';

import Container from '@mui/material/Container';

import ProductDetailsContainer from '@/containers/product-details-container/ProductDetailsContainer';

const product = {
  categoryId: 'category-1',
  description: 'Pure, unprocessed cocoa powder',
  id: 'product-1',
  images: ['image1.jpg', 'image2.jpg'],
  lowStockThreshold: 10,
  name: 'Raw Cocoa Powder',
  stock: 280,
  variants: [
    {
      id: 'variant-1',
      images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
      packaging: { type: 'SACHET' },
      price: 5.99,
      stock: 50,
      weight: 100,
    },
    {
      id: 'variant-2',
      images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
      packaging: { type: 'CARTON_OF_SACHETS' },
      price: 30.99,
      stock: 30,
      weight: 100,
    },
    {
      id: 'variant-3',
      images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
      packaging: { type: 'SACHET' },
      price: 12.99,
      stock: 30,
      weight: 200,
    },
    {
      id: 'variant-4',
      images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
      packaging: { type: 'CARTON_OF_SACHETS' },
      price: 39.99,
      stock: 30,
      weight: 200,
    },
    {
      id: 'variant-5',
      images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
      packaging: { type: 'SACHET' },
      price: 12.99,
      stock: 30,
      weight: 1000,
    },
    {
      id: 'variant-6',
      images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
      packaging: { type: 'CARTON_OF_SACHETS' },
      price: 65.99,
      stock: 30,
      weight: 1000,
    },
    {
      id: 'variant-7',
      images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
      packaging: { type: 'JAR' },
      price: 5.99,
      stock: 50,
      weight: 400,
    },
    {
      id: 'variant-8',
      images: ['variant1-image1.jpg', 'variant1-image2.jpg'],
      packaging: { type: 'JAR' },
      price: 5.99,
      stock: 50,
      weight: 500,
    },
    {
      id: 'variant-9',
      images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
      packaging: { type: 'CARTON_OF_JARS' },
      price: 45.99,
      stock: 30,
      weight: 400,
    },
    {
      id: 'variant-10',
      images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
      packaging: { type: 'CARTON_OF_JARS' },
      price: 45.99,
      stock: 30,
      weight: 500,
    },
    {
      id: 'variant-11',
      images: ['variant2-image1.jpg', 'variant2-image2.jpg'],
      packaging: { type: 'CARTON_OF_JARS' },
      price: 45.99,
      stock: 30,
      weight: 200,
    },
  ],
};

// Define the variant properties and labels
const variantProps = ['packaging.type', 'weight']; // Dynamic variant properties

const labels = {
  packaging: 'Packaging',
  weight: 'Weight',
};

const disableOptions = {
  packaging: false, // Do not disable packaging options
  weight: true, // Disable unavailable weight options
};

function Home() {
  return (
    <Container maxWidth="xl" disableGutters>
      <ProductDetailsContainer
        product={product}
        variantProps={variantProps}
        labels={labels}
        disableOptions={disableOptions}
      />
    </Container>
  );
}

export default Home;
