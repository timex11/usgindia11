import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  isHighContrast: boolean;
  isDarkMode: boolean;
  activeTheme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (isOpen: boolean) => void;
  toggleHighContrast: () => void;
  setDarkMode: (isDark: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isSearchOpen: false,
      isHighContrast: false,
      isDarkMode: false,
      activeTheme: 'system',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
      toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      setTheme: (theme) => set({ activeTheme: theme }),
    }),
    {
      name: 'usg-ui-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
