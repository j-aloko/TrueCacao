export const getLocalStorageData = (key, fallback) => {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return fallback;
    }
  }
  return fallback;
};
