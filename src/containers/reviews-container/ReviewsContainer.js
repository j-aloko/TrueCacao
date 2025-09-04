import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import UserList from '@/components/user-list/UserList';

const reviews = [
  {
    comment:
      'Amazing quality! The richness and aroma of this cocoa powder are unmatched. Perfect for baking and hot chocolate.',
    createdAt: new Date(),
    id: '1',
    productId: 'cocoa_powder_01',
    rating: 5,
    updatedAt: new Date(),
    user: { email: 'alice@example.com', id: 'user_01', name: 'Alice' },
  },
  {
    comment:
      'A deep, bittersweet flavor that true dark chocolate lovers will appreciate. Could be a little smoother, though.',
    createdAt: new Date(),
    id: '2',
    productId: 'dark_chocolate_01',
    rating: 4,
    updatedAt: new Date(),
    user: { email: 'bob@example.com', id: 'user_02', name: 'Bob' },
  },
  {
    comment:
      'Good cocoa powder, but packaging could be improved. Some powder spilled when I opened it.',
    createdAt: new Date(),
    id: '3',
    productId: 'cocoa_powder_01',
    rating: 3,
    updatedAt: new Date(),
    user: { email: 'charlie@example.com', id: 'user_03', name: 'Charlie' },
  },
  {
    comment:
      'Best dark chocolate I’ve ever tasted. Smooth, rich, and not overly sweet. Will be ordering again!',
    createdAt: new Date(),
    id: '4',
    productId: 'dark_chocolate_02',
    rating: 5,
    updatedAt: new Date(),
    user: { email: 'david@example.com', id: 'user_04', name: 'David' },
  },
  {
    comment:
      'Not what I expected. It has a slightly bitter aftertaste. Maybe good for baking but not for direct consumption.',
    createdAt: new Date(),
    id: '5',
    productId: 'cocoa_powder_02',
    rating: 2,
    updatedAt: new Date(),
    user: { email: 'emma@example.com', id: 'user_05', name: 'Emma' },
  },
  {
    comment:
      'Loved the deep cocoa taste! It’s a bit too hard straight from the fridge, but melts beautifully in recipes.',
    createdAt: new Date(),
    id: '6',
    productId: 'dark_chocolate_01',
    rating: 4,
    updatedAt: new Date(),
    user: { email: 'frank@example.com', id: 'user_06', name: 'Frank' },
  },
  {
    comment:
      'Absolutely great for making homemade chocolates! High quality and very fine texture.',
    createdAt: new Date(),
    id: '7',
    productId: 'cocoa_powder_01',
    rating: 5,
    updatedAt: new Date(),
    user: { email: 'grace@example.com', id: 'user_07', name: 'Grace' },
  },
  {
    comment:
      'Average quality compared to other premium chocolates. A bit too bitter for my liking.',
    createdAt: new Date(),
    id: '8',
    productId: 'dark_chocolate_02',
    rating: 3,
    updatedAt: new Date(),
    user: { email: 'henry@example.com', id: 'user_08', name: 'Henry' },
  },
  {
    comment:
      'Deep cocoa flavor with no unnecessary additives. Works great for smoothies and desserts!',
    createdAt: new Date(),
    id: '9',
    productId: 'cocoa_powder_02',
    rating: 4,
    updatedAt: new Date(),
    user: { email: 'isabella@example.com', id: 'user_09', name: 'Isabella' },
  },
  {
    comment:
      'Superb quality! I’m a dark chocolate fan, and this exceeded my expectations.',
    createdAt: new Date(),
    id: '10',
    productId: 'dark_chocolate_01',
    rating: 5,
    updatedAt: new Date(),
    user: { email: 'jack@example.com', id: 'user_10', name: 'Jack' },
  },
];

function ReviewsContainer() {
  return (
    <Box flexGrow={1}>
      <Stack spacing={2}>
        {React.Children.toArray(
          reviews.map((review) => <UserList {...review} key={review.id} />)
        )}
      </Stack>
    </Box>
  );
}

export default ReviewsContainer;
