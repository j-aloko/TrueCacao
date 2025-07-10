'use client';

import { useEffect } from 'react';

import Cookies from 'js-cookie';

import { refreshAccessToken } from '@/services/redux/features/auth/authSlice';
import { useAppDispatch } from '@/services/redux/store';

export function useSessionBoot() {
  const dispatch = useAppDispatch();

  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');

  useEffect(() => {
    const bootSession = async () => {
      if (accessToken && refreshToken) {
        dispatch(refreshAccessToken());
      }
    };

    bootSession();
  }, [accessToken, dispatch, refreshToken]);
}
