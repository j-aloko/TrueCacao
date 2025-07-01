export const storeRedirectUrl = (url) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('preAuthUrl', url);
  }
};

export const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('preAuthUrl') || '/';
  }
  return '/';
};

export const clearRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('preAuthUrl');
  }
};
