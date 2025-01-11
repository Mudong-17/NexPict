import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand/react';

interface UserStore {
  id: string;
  nickname: string;
  email: string;
  avatar: string;

  setUserInfo: (userInfo: UserInfo) => void;
}

export type UserInfo = Pick<UserStore, 'id' | 'nickname' | 'email' | 'avatar'>;

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      id: '',
      nickname: '',
      email: '',
      avatar: '',

      setUserInfo: (userInfo: UserInfo) => {
        set(userInfo);
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
