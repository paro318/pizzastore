import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

type AuthData = {
  session: Session | null;
  loading: boolean;
  profile: any;
  isAdmin: boolean;
};
const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState();

  useEffect(() => {
    console.log('Auth is mounted');
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      //   console.log('SESSION', result);
      setSession(session);

      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session?.user.id)
          .single();
        setProfile(data || null);
      }
      setLoading(false);
    };
    fetchSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  console.log('PROFILE', profile);
  return (
    <AuthContext.Provider
      value={{ session, loading, profile, isAdmin: profile?.group === 'ADMIN' }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
