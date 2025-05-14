import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import TextBlock from '../text-block/TextBlock';

function CheckoutTotals({ item }) {
  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <TextBlock text={item.name} variant="body2" component="span" />
      </CardContent>
      <CardContent>
        <TextBlock text={item.amount} variant="body2" component="span" />
      </CardContent>
    </Card>
  );
}

export default CheckoutTotals;
