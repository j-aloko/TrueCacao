'use client';

import React from 'react';

import { useSessionBoot } from '@/hooks/useSessionBoot';

export default function SessionBootProvider({ children }) {
  useSessionBoot();

  return <>{children}</>;
}
