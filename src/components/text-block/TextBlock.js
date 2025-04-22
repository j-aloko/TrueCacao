import React from 'react';

import Typography from '@mui/material/Typography';

import { clean } from '@/util/cleanHtml';

function TextBlock({
  text = null,
  isHtmlString = false,
  textAlign = 'left',
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
      textAlign={textAlign}
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

export default React.memo(TextBlock);
