import { create } from 'zustand';

type LanguageState = {
  language: 'en' | 'cn';
};

type LanguageAction = {
  setLanguage: (language: 'en' | 'cn') => void;
};

const initialState: LanguageState = {
  language: 'en',
};

export const useLanguageStore = create<LanguageState & LanguageAction>((set) => ({
  ...initialState,

  setLanguage: (language) => set({ language }),
}));
