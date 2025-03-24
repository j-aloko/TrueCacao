import React from 'react';

import TextBlock from '../text-block/TextBlock';

function ProductPrice({ price }) {
  return <TextBlock text={price} variant="h6" component="h2" />;
}

export default ProductPrice;
