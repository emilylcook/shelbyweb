import React from 'react';
import { useCookies } from 'react-cookie';

import firebase from '../firebase';

declare type AuthenticatedUser = any | null;

type AuthContextType = {
  isAuthenticated: boolean;
  user: AuthenticatedUser;
  logIn: (username: string, password: string) => Promise<any>;
  logOut: () => Promise<any>;
};

export const AuthContext = React.createContext<AuthContextType>(undefined!);

export function AuthProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const email = cookies.user;

        if (email) {
          setUser({ email: email });
        }
      } catch (error) {
        console.log(error);
        setUser(null);
        console.log('Error fetching current session:', error);
      }
    }
    fetchUser();
    // eslint-disable-next-line
  }, []);

  async function logIn(email: string, password: string) {
    const result = await firebase.auth().signInWithEmailAndPassword(email, password);

    if (result) {
      setUser({ email: result?.user?.email });

      let expiresOn = new Date();
      expiresOn.setHours(expiresOn.getHours() + 12);

      setCookie('user', result?.user?.email, { path: '/', expires: expiresOn });
    }
  }

  async function logOut() {
    removeCookie('user');
    setUser(null);
  }

  const isAuthenticated = !!user;

  const isLoading = user === undefined;

  const values = React.useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      user,
      logIn,
      logOut,
      isLoading
    }),
    // eslint-disable-next-line
    [user, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={values} {...props} />;
}

export default function useAuth() {
  return React.useContext(AuthContext);
}
