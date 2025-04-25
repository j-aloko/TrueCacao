import React from 'react';

import TextBlock from '../text-block/TextBlock';

function ProductDetailedDescription({ detailedDescription }) {
  return (
    <TextBlock
      text={detailedDescription}
      variant="body1"
      isHtmlString
      component="div"
    />
  );
}

export default ProductDetailedDescription;
