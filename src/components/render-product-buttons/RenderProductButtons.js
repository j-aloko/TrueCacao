import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function RenderProductButtons({
  submitting = false,
  addingItem = false,
  onAddToCart = null,
}) {
  return (
    <Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        loading={addingItem}
        loadingPosition="end"
        disabled={submitting}
        onClick={onAddToCart}
      >
        {addingItem ? 'Adding...' : 'Add to Cart'}
      </Button>
    </Box>
  );
}

export default React.memo(RenderProductButtons);
