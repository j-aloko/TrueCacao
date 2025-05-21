import React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Logo from '../logo/Logo';
import Tooltip from '../tooltip/Tooltip';

function Navbar({
  pages,
  cart,
  settings,
  anchorElNav,
  anchorElUser,
  onOpenNavMenu,
  onOpenUserMenu,
  onCloseNavMenu,
  onCloseUserMenu,
  onToggleCartDrawer,
}) {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: (theme) => theme.palette.common.white,
        boxShadow: 'none',
        zIndex: 999,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo variant="desktop" />
          <Box sx={{ display: { md: 'none', xs: 'flex' }, flexGrow: 1 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={onOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom',
              }}
              keepMounted
              transformOrigin={{
                horizontal: 'left',
                vertical: 'top',
              }}
              open={Boolean(anchorElNav)}
              onClose={onCloseNavMenu}
              sx={{ display: { md: 'none', xs: 'block' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={onCloseNavMenu}>
                  <Typography color="primary" sx={{ textAlign: 'center' }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Logo variant="mobile" />
          <Box
            sx={{
              display: { md: 'flex', xs: 'none' },
              flexGrow: 1,
              gap: 2,
              justifyContent: 'center',
            }}
          >
            {pages.map((page) => (
              <Typography
                variant="subtitle1"
                color="primary"
                key={page}
                onClick={onCloseNavMenu}
                sx={{ cursor: 'pointer' }}
              >
                {page}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 0, gap: 2 }}>
            <Tooltip title="Cart">
              <IconButton aria-label="cart" onClick={onToggleCartDrawer}>
                <Badge
                  badgeContent={cart?.lines?.length || 0}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: 'secondary.light',
                      color: 'secondary.contrastText',
                      fontSize: '0.85rem',
                      top: 2,
                    },
                  }}
                >
                  <ShoppingCartIcon fontSize="large" color="primary" />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Open settings">
              <IconButton onClick={onOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  RS
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'top',
              }}
              keepMounted
              transformOrigin={{
                horizontal: 'right',
                vertical: 'top',
              }}
              open={Boolean(anchorElUser)}
              onClose={onCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={onCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
