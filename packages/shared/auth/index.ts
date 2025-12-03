export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ctt_access_token');
};

export const requireAuth = () => {
  // placeholder middleware for server/client
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');
  return token;
};
