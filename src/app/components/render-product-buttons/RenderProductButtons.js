import React from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function RenderProductButtons({
  submitting = false,
  onAddToCart = null,
  onBuyNow = null,
}) {
  return (
    <Stack direction="column" spacing={2} mt={2}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={submitting}
        onClick={onAddToCart}
      >
        Add to Cart
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={submitting}
        onClick={onBuyNow}
      >
        Buy it Now
      </Button>
    </Stack>
  );
}

export default React.memo(RenderProductButtons);
