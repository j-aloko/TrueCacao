'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import TextBlock from '../text-block/TextBlock';

function HeroSection() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: {
          lg: 500,
          md: 420,
        },
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundImage:
            'url(/product-images/elle-inlom-VcUH1qneMeg-unsplash.jpg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          filter: 'brightness(75%)',
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          transition: 'opacity 1s ease-in-out',
          width: '100%',
        }}
        role="img"
      />

      {/* Content */}
      <Container>
        <Box
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 1,
            color: 'common.white',
            maxWidth: 800,
            mx: 'auto',
            p: 3,
            position: 'relative',
            textAlign: 'center',
            width: { sm: 'auto', xs: '90%' },
            zIndex: 2,
          }}
        >
          <TextBlock
            text="Discover the Essence of True Cocoa"
            variant="h3"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={(theme) => ({ color: theme.palette.primary.contrastText })}
          />

          <TextBlock
            text="Premium quality raw cocoa powder and dark chocolates, sourced
            ethically from the finest cocoa beans."
            variant="h6"
            component="p"
            textAlign="center"
            gutterBottom
            sx={(theme) => ({
              color: theme.palette.primary.contrastText,
              mb: 3,
            })}
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              '&:focus': {
                outline: '2px solid white',
              },
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              color: 'common.white',
              mt: 3,
              px: 4,
              py: 1.5,
            }}
          >
            Explore Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;
