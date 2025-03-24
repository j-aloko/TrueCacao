import React from 'react';

import TextBlock from '../text-block/TextBlock';

function ProductDescription({ productDescription }) {
  return (
    <TextBlock
      text={productDescription}
      variant="body1"
      isHtmlString
      component="div"
    />
  );
}

export default ProductDescription;
