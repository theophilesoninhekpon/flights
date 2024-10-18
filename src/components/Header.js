import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

// Application bar
const Header = () => {
  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)', 
      }}
    >      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6">Flights</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;