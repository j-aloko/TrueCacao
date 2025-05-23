import React from 'react';

import Typography from '@mui/material/Typography';

import { clean } from '@/util/cleanHtml';

function TextBlock({
  text = null,
  isHtmlString = false,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  gutterBottom = false,
  noWrap = false,
  sx = null,
  component = 'div',
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
      {...(isHtmlString
        ? { dangerouslySetInnerHTML: { __html: clean(text) } }
        : { children: text })}
    />
  );
}

export default TextBlock;
