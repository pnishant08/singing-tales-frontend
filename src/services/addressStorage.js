const ADDRESSES_KEY = "singing_tales_addresses";

export const readSavedAddresses = () => {
  try {
    const value = localStorage.getItem(ADDRESSES_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

export const writeSavedAddresses = (addresses) => {
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
};
