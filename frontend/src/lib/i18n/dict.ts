import { en } from './locales/en';
import { hi } from './locales/hi';

export const dict = {
  en,
  hi,
};

export type Language = keyof typeof dict;
export type Dictionary = typeof dict.en;
