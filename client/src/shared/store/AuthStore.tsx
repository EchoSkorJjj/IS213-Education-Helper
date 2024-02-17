import { EncryptStorage } from "encrypt-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AuthStateType, ZustandStorageType } from "~types";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

const encryptedStorage = new EncryptStorage(STORAGE_KEY, {
  storageType: "sessionStorage",
  stateManagementUse: true,
});

const customSessionStorage: ZustandStorageType = {
  getItem: async (key) => {
    const item = await encryptedStorage.getItem(key);
    return item !== undefined ? item : null;
  },
  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      try {
        encryptedStorage.setItem(key, value);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  removeItem: (key) => {
    return new Promise((resolve, reject) => {
      try {
        encryptedStorage.removeItem(key);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
};

const useAuthStore = create<AuthStateType>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      role: null,
      login: (userData, roleData) => {
        set({
          user: userData,
          role: roleData,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          role: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => customSessionStorage),
    },
  ),
);

export default useAuthStore;
