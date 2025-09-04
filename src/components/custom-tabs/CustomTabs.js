import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

function TabPanel(props) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    'aria-controls': `tabpanel-${index}`,
    id: `tab-${index}`,
  };
}

export default function CustomTabs({
  tabs,
  defaultTab = 0,
  centered = false,
  sx,
  tabSx,
  panelSx,
  onChange,
}) {
  const [value, setValue] = useState(defaultTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs"
          centered={centered}
        >
          {React.Children.toArray(
            tabs.map((tab, index) => (
              <Tab
                key={tab.label}
                label={tab.label}
                disabled={tab.disabled}
                icon={tab.icon}
                iconPosition="start"
                {...a11yProps(index)}
                sx={tabSx}
              />
            ))
          )}
        </Tabs>
      </Box>
      {React.Children.toArray(
        tabs.map((tab, index) => (
          <TabPanel key={tab.label} value={value} index={index} sx={panelSx}>
            <Box flexGrow={1}>
              <Stack spacing={2}>
                {tab.heading}
                {tab.content}
              </Stack>
            </Box>
          </TabPanel>
        ))
      )}
    </Box>
  );
}
