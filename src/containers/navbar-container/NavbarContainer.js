'use client';

import React, { useState } from 'react';

import Navbar from '@/components/navbar/Navbar';
import { toggleDrawer } from '@/services/redux/features/cart-drawer/cartDrawerSlice';
import { useAppDispatch } from '@/services/redux/store';

const pages = ['Contact Us', 'Track Your Order'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function NavbarContainer() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const dispatch = useAppDispatch();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Navbar
      pages={pages}
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

export default NavbarContainer;
