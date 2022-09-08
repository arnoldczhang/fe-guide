import { target } from './env';

const useStorage = typeof target.chrome !== 'undefined' && typeof target.chrome.storage !== 'undefined';

let storageData: any = null;

export const initStorage = () => {
  return new Promise((resolve) => {
    if (useStorage) {
      target.chrome.storage.local.get(null, (result: any) => {
        storageData = result;
        resolve(true);
      });
    } else {
      storageData = {};
      resolve(true);
    }
  });
};

export const getStorage = async (key: string, defaultValue: any = null) => {
  await checkStorage();
  if (useStorage) {
    return getDefaultValue(storageData[key], defaultValue);
  } else {
    try {
      return getDefaultValue(JSON.parse(localStorage.getItem(key) || 'null'), defaultValue);
    } catch (e) {}
  }
};

export const setStorage = async (key: string, val: any) => {
  await checkStorage();
  if (useStorage) {
    storageData[key] = val;
    target.chrome.storage.local.set({ [key]: JSON.parse(JSON.stringify(val)) });
  } else {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
};

export const removeStorage = async (key: string) => {
  await checkStorage();
  if (useStorage) {
    delete storageData[key];
    target.chrome.storage.local.remove([key]);
  } else {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

export const clearStorage = async () => {
  await checkStorage();
  if (useStorage) {
    storageData = {};
    target.chrome.storage.local.clear();
  } else {
    try {
      localStorage.clear();
    } catch (e) {}
  }
};

const checkStorage = async () => {
  if (!storageData) {
    await initStorage();
  }
};

const getDefaultValue = (value: any, defaultValue: any) => {
  if (value == null) {
    return defaultValue;
  }
  return value;
};
