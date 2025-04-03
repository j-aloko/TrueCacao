import React from 'react';

import { styled } from '@mui/material/styles';
import MuiTooltip, { tooltipClasses } from '@mui/material/Tooltip';

const Tooltip = styled(({ className, ...props }) => (
  <MuiTooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default Tooltip;
