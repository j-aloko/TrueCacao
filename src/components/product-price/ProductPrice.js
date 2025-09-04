import React from 'react';

import TextBlock from '../text-block/TextBlock';

function ProductPrice({ price }) {
  return (
    <TextBlock text={price} color="secondary" variant="h6" component="p" />
  );
}

export default ProductPrice;
