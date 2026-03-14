import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: !!user && !!token,
          isLoading: false
        }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        const supabase = createClient();
        supabase.auth.signOut();
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },
      initialize: () => {
        const supabase = createClient();
        
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              role: (session.user.user_metadata?.role as string) || 'student',
              fullName: session.user.user_metadata?.full_name as string,
              avatarUrl: session.user.user_metadata?.avatar_url as string,
              aadhaarNumber: session.user.user_metadata?.aadhaarNumber as string,
              universityId: session.user.user_metadata?.universityId as string,
              collegeId: session.user.user_metadata?.collegeId as string,
              user_metadata: session.user.user_metadata,
            };
            get().setAuth(user, session.access_token);
          } else {
            set({ isLoading: false });
          }
        });

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              role: (session.user.user_metadata?.role as string) || 'student',
              fullName: session.user.user_metadata?.full_name as string,
              avatarUrl: session.user.user_metadata?.avatar_url as string,
              aadhaarNumber: session.user.user_metadata?.aadhaarNumber as string,
              universityId: session.user.user_metadata?.universityId as string,
              collegeId: session.user.user_metadata?.collegeId as string,
              user_metadata: session.user.user_metadata,
            };
            get().setAuth(user, session.access_token);
          } else {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          }

          if (event === 'SIGNED_OUT') {
            // We might need to trigger a refresh here, but we can't use router here.
            // That's why a component might still be needed for the side effect.
          }
        });

        return () => subscription.unsubscribe();
      },
    }),
    {
      name: 'usg-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
