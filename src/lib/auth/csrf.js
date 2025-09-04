export async function getCsrfToken() {
  const response = await fetch('/api/v1/auth/csrf', {
    credentials: 'include',
    method: 'GET',
  });
  const { csrfToken } = await response.json();
  return csrfToken;
}
