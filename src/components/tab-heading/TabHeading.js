import React from 'react';

import TextBlock from '../text-block/TextBlock';

function TabHeading({ name }) {
  return (
    <TextBlock
      text={name}
      variant="h6"
      component="h2"
      sx={() => ({
        mb: 6,
      })}
    />
  );
}

export default TabHeading;
