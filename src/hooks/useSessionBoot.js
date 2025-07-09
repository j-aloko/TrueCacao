import { useEffect } from 'react';

import {
  refreshAccessToken,
  logoutUser,
} from '@/services/redux/features/auth/authSlice';
import { useAppDispatch } from '@/services/redux/store';

export function useSessionBoot() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const bootSession = async () => {
      try {
        await dispatch(refreshAccessToken()).unwrap(); // Session is now active
      } catch {
        dispatch(logoutUser()); // Clear stale session if refresh fails
      }
    };

    bootSession();
  }, [dispatch]);
}
