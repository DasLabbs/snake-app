import { Social, User } from '@src/libs/types/user.action';
import { create } from 'zustand';

type UserState = {
  user: User | null;
  socialLinks: Social[];
  numberAdsWatched: number;
};

type UserAction = {
  setUser: (user: User) => void;
  setSocialLinks: (socialLinks: Social[]) => void;
  addSocial: (social: Social) => void;
  setNumberAdsWatched: (numberAdsWatched: number) => void;
  incrementAdsWatched: () => void;
  reset: () => void;
};

const initialState: UserState = {
  user: null,
  socialLinks: [],
  numberAdsWatched: 0,
};

export const useUserStore = create<UserState & UserAction>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),

  setSocialLinks: (socialLinks) => set({ socialLinks }),

  setNumberAdsWatched: (numberAdsWatched) => set({ numberAdsWatched }),

  incrementAdsWatched: () =>
    set((state) => ({
      numberAdsWatched: state.numberAdsWatched + 1,
    })),

  addSocial: (social) =>
    set((state) => ({
      socialLinks: [...state.socialLinks, social],
    })),

  reset: () =>
    set({
      user: null,
    }),
}));
