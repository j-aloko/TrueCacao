import React from 'react';

import TextBlock from '../text-block/TextBlock';

function ProductSummarizedDescription({ summary }) {
  return <TextBlock text={summary} variant="body1" component="p" />;
}

export default ProductSummarizedDescription;
