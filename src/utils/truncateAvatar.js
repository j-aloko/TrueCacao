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
  /* eslint-enable no-bitwise */

  return color;
}

export function truncateAvatar(name) {
  const parts = name.trim().split(/\s+/); // Remove extra spaces and split by any whitespace

  let initials = '';
  if (parts.length === 1) {
    // eslint-disable-next-line prefer-destructuring
    initials = parts[0][0]; // First letter of the single word
  } else {
    initials = `${parts[0][0]}${parts[1][0]}`; // First letters of the first two words
  }

  return {
    children: initials.toUpperCase(),
    sx: {
      bgcolor: stringToColor(name),
    },
  };
}
