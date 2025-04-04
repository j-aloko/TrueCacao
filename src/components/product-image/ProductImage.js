import React from 'react';

import AspectRatioImage from '../aspect-ratio-image/AspectRatioImage';

function ProductImage({ image }) {
  return <AspectRatioImage src={image} priority />;
}

export default React.memo(ProductImage);
