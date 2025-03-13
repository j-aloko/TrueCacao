import React from 'react';

import Typography from '@mui/material/Typography';

function TextBlock({
  text = null,
  variant = 'body1',
  align = 'left',
  gutterBottom = true,
  noWrap = false,
  customStyle = null,
  component = null,
}) {
  return (
    <Typography
      variant={variant}
      component={component}
      align={align}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      sx={customStyle}
    >
      {text}
    </Typography>
  );
}

export default TextBlock;
