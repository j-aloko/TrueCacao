'use client';

import React, { useCallback, useMemo, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { shallowEqual } from 'react-redux';

import Navbar from '@/components/navbar/Navbar';
import { ROUTES } from '@/constants/routes';
import { logoutUser } from '@/services/redux/features/auth/authSlice';
import { toggleDrawer } from '@/services/redux/features/cart-drawer/cartDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';

function NavbarContainer() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { cart } = useAppSelector(
    (state) => ({
      cart: state.cart.cart,
    }),
    shallowEqual
  );

  const { user, isLoading } = useAppSelector(
    (state) => ({
      isLoading: state.auth.isLoading,
      user: state.auth.user,
    }),
    shallowEqual
  );

  const handleOpenNavMenu = useCallback((event) => {
    setAnchorElNav(event.currentTarget);
  }, []);

  const handleOpenUserMenu = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser({ router })).unwrap();
    setAnchorElUser(null);
  }, [dispatch, router]);

  const pages = useMemo(
    () => [
      {
        id: 'contact-us',
        link: ROUTES.contactUs,
        name: 'Contact Us',
        onClick: handleCloseNavMenu,
      },
      {
        id: 'track-your-order',
        link: ROUTES.trackOrder,
        name: 'Track Your Order',
        onClick: handleCloseNavMenu,
      },
    ],
    [handleCloseNavMenu]
  );

  const settings = useMemo(
    () => [
      {
        id: 'account',
        link: ROUTES.account,
        name: 'Account',
        onClick: handleCloseUserMenu,
      },
      {
        id: 'settings',
        link: ROUTES.settings,
        name: 'Settings',
        onClick: handleCloseUserMenu,
      },
      {
        id: 'logout',
        link: null,
        name: isLoading ? <CircularProgress size="18px" /> : 'Logout',
        onClick: handleLogout,
      },
    ],
    [handleCloseUserMenu, handleLogout, isLoading]
  );

  return (
    <Navbar
      user={user}
      pages={pages}
      cart={cart}
      settings={settings}
      anchorElNav={anchorElNav}
      anchorElUser={anchorElUser}
      onOpenNavMenu={handleOpenNavMenu}
      onOpenUserMenu={handleOpenUserMenu}
      onCloseNavMenu={handleCloseNavMenu}
      onCloseUserMenu={handleCloseUserMenu}
      onToggleCartDrawer={() => dispatch(toggleDrawer())}
    />
  );
}

export default React.memo(NavbarContainer);
