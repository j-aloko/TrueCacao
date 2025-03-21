import React from 'react';

import Typography from '@mui/material/Typography';

function TextBlock({
  text = null,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  gutterBottom = true,
  noWrap = false,
  sx = null,
  component = null,
}) {
  return (
    <Typography
      variant={variant}
      color={color}
      component={component}
      align={align}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      sx={sx}
    >
      {text}
    </Typography>
  );
}

export default TextBlock;
