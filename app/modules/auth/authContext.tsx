import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { z } from "zod";

type AuthContextType = {
  user: null | { id: string; token: string };
  isLoading: boolean;
  storeUser: (user: AuthContextType["user"]) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  storeUser: () => Promise.resolve(undefined),
});

export const AUTH_STORE_KEY = "AUTH_STORE_KEY";
const storeSchema = z.object({
  id: z.string(),
  token: z.string(),
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    (async () => {
      const data = await getItemAsync(AUTH_STORE_KEY);
      if (data === null) {
        return null;
      }

      try {
        return storeSchema.parse(JSON.parse(data));
      } catch {
        return null;
      }
    })()
      .then((user) => setUser(user))
      .finally(() => setIsLoading(false));
  }, []);

  const storeUser = async (user: AuthContextType["user"]) => {
    console.log(user);

    await setItemAsync(AUTH_STORE_KEY, JSON.stringify(user));
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, storeUser, isLoading }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext).user;
