import React from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
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
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { truncateAvatar } from '@/utils/truncateAvatar';

import Logo from '../logo/Logo';
import Tooltip from '../tooltip/Tooltip';

function Navbar({
  user,
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
              {pages.map(({ id, name, onClick, link }) => (
                <MenuItem key={id} onClick={onClick}>
                  {link ? (
                    <Typography
                      component={Link}
                      href={link}
                      color="primary"
                      sx={{ textAlign: 'center' }}
                    >
                      {name}
                    </Typography>
                  ) : (
                    <Typography color="primary" sx={{ textAlign: 'center' }}>
                      {name}
                    </Typography>
                  )}
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
            {pages.map(({ id, name, onClick, link }) => (
              <Box key={id} component="div">
                {link ? (
                  <Typography
                    component={Link}
                    href={link}
                    variant="subtitle1"
                    color="primary"
                    onClick={onClick}
                    sx={{ cursor: 'pointer' }}
                  >
                    {name}
                  </Typography>
                ) : (
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    onClick={onClick}
                    sx={{ cursor: 'pointer' }}
                  >
                    {name}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexGrow: 0,
              gap: 3,
            }}
          >
            <Tooltip title="Cart">
              <IconButton aria-label="cart" onClick={onToggleCartDrawer}>
                <Badge
                  badgeContent={cart?.lines?.length || 0}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.85rem',
                      top: 2,
                    },
                  }}
                >
                  <ShoppingBasketIcon fontSize="large" color="primary" />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title={user ? 'Open settings' : 'Login'}>
              <IconButton onClick={user ? onOpenUserMenu : null} sx={{ p: 0 }}>
                {user ? (
                  <Avatar
                    {...truncateAvatar(user.name)}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  />
                ) : (
                  <Link href={ROUTES.login}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                      }}
                    >
                      <PersonIcon fontSize="medium" />
                    </Avatar>
                  </Link>
                )}
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
              {settings.map(({ id, name, onClick, link }) => (
                <MenuItem key={id} onClick={onClick}>
                  {link ? (
                    <Typography
                      sx={{ textAlign: 'center' }}
                      component={Link}
                      href={link}
                    >
                      {name}
                    </Typography>
                  ) : (
                    <Typography sx={{ textAlign: 'center' }}>{name}</Typography>
                  )}
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
