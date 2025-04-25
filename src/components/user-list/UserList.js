import React from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import Review from '../Review/Review';
import TextBlock from '../text-block/TextBlock';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  if (!name || name.split(' ').length < 2) {
    return { children: name ? name[0] : '?', sx: { bgcolor: '#ccc' } };
  }

  return {
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    sx: {
      bgcolor: stringToColor(name),
    },
  };
}

export default function UserList({ user: { name }, comment, rating }) {
  return (
    <Box
      flexGrow={1}
      display="flex"
      alignItems="center"
      gap={3}
      maxWidth="sm"
      width="100%"
      bgcolor="background.paper"
      p={2}
    >
      <Avatar {...stringAvatar(name)} />
      <Stack>
        <Box display="flex" alignItems="center" gap={2}>
          <TextBlock text={name} variant="subtitle1" component="span" />
          <Review value={rating} />
        </Box>
        <TextBlock
          text={comment}
          variant="body2"
          isHtmlString
          component="span"
        />
      </Stack>
    </Box>
  );
}
