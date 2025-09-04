import { useEffect } from 'react';

import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

import {
  refreshAccessToken,
  setLastVisitedPage,
} from '@/services/redux/features/auth/authSlice';
import { useAppDispatch } from '@/services/redux/store';

export function useSessionBoot() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const redirect = searchParams.get('redirect');

    if (redirect) {
      dispatch(setLastVisitedPage(decodeURIComponent(redirect)));
    }

    const bootSession = async () => {
      if (accessToken && refreshToken) {
        dispatch(refreshAccessToken());
      }
    };

    bootSession();
  }, [dispatch, searchParams]);
}
