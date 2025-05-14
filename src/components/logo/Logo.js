import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';

function Logo({ variant = 'desktop' }) {
  return (
    <Typography
      variant="h4"
      noWrap
      component={Link}
      href={ROUTES.home}
      sx={{
        color: 'inherit',
        display: {
          md: variant === 'desktop' ? 'flex' : 'none',
          xs: variant === 'mobile' ? 'flex' : 'none',
        },
        flexGrow: variant === 'mobile' ? 1 : 0,
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        mr: 2,
        textDecoration: 'none',
      }}
    >
      <Box component="span" sx={{ color: 'primary.main' }}>
        True
      </Box>
      <Box component="span" sx={{ color: 'secondary.main' }}>
        Cacao
      </Box>
    </Typography>
  );
}

export default Logo;
