import React from 'react';

import TextBlock from '../text-block/TextBlock';

function ProductName({ name }) {
  return <TextBlock text={name} variant="h5" component="h3" />;
}

export default ProductName;
