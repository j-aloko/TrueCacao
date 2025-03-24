import React from 'react';

import TextBlock from '../text-block/TextBlock';

function ProductName({ name }) {
  return (
    <TextBlock
      text={name}
      variant="h5"
      component="h1"
      sx={(theme) => ({
        color: theme.palette.primary.dark,
        fontWeight: 500,
      })}
    />
  );
}

export default ProductName;
