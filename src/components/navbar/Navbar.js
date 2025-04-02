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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

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
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              color: 'inherit',
              display: { md: 'flex', xs: 'none' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              mr: 2,
              textDecoration: 'none',
            }}
          >
            COCOAHUB
          </Typography>
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
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              color: 'inherit',
              display: { md: 'none', xs: 'flex' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              mr: 2,
              textDecoration: 'none',
            }}
          >
            COCOAHUB
          </Typography>
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
                key={page}
                onClick={onCloseNavMenu}
                sx={{ cursor: 'pointer' }}
              >
                {page}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 0, gap: 2 }}>
            <IconButton aria-label="cart" onClick={onToggleCartDrawer}>
              <Badge badgeContent={cart?.lines?.length || 0} color="secondary">
                <ShoppingCartIcon
                  fontSize="medium"
                  sx={(theme) => ({
                    color: theme.palette.primary.contrastText,
                  })}
                />
              </Badge>
            </IconButton>
            <Tooltip title="Open settings">
              <IconButton onClick={onOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>RS</Avatar>
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
