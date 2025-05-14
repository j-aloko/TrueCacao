import React from 'react';

import Rating from '@mui/material/Rating';

function Review({
  value,
  precision = 0.5,
  isreadOnly = true,
  name = 'read-only-half-rating',
  onReview = null,
}) {
  return (
    <Rating
      name={name}
      defaultValue={value}
      precision={precision}
      readOnly={isreadOnly}
      onChange={onReview}
    />
  );
}

export default Review;
