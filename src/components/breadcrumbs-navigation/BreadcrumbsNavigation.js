'use client';

import React from 'react';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

function BreadcrumbsNavigation({
  pathMap = {},
  color = 'inherit',
  currentPageColor = 'text.primary',
  separator = '/',
}) {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  // Always include Home as the first breadcrumb
  const breadcrumbPaths = ['', ...paths];

  return (
    <div role="navigation">
      <Breadcrumbs separator={separator} aria-label="breadcrumb-navigation">
        {React.Children.toArray(
          breadcrumbPaths.map((path, index) => {
            const href =
              index === 0
                ? '/'
                : `/${breadcrumbPaths.slice(1, index + 1).join('/')}`;
            const isCurrentPage = index === breadcrumbPaths.length - 1;
            const label =
              pathMap[path] ||
              (path === ''
                ? 'Home'
                : path.charAt(0).toUpperCase() + path.slice(1));

            return (
              <Link
                key={path}
                component={NextLink}
                underline="hover"
                color={isCurrentPage ? currentPageColor : color}
                href={href}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })
        )}
      </Breadcrumbs>
    </div>
  );
}

export default BreadcrumbsNavigation;
