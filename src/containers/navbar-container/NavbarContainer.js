'use client';

import React, { useState } from 'react';

import Navbar from '@/components/navbar/Navbar';

const pages = ['Contact Us', 'Track Your Order'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function NavbarContainer() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

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
    />
  );
}

export default NavbarContainer;
