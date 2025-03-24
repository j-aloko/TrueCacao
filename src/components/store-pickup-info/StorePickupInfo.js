import React from 'react';

import TextBlock from '../text-block/TextBlock';

function StorePickupInfo({ pickupInfo }) {
  return (
    <TextBlock text={pickupInfo} variant="body1" isHtmlString component="div" />
  );
}

export default StorePickupInfo;
