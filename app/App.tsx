import "react-native-gesture-handler";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./modules/auth/authContext";
import { LoginScreen } from "./modules/auth/screens/login";
import { Browser } from "./modules/browser/screens";

const App = () => {
  const auth = useAuth();

  if (!auth?.id) {
    return <LoginScreen />;
  }

  return <Browser />;
};

const queryClient = new QueryClient();

export default function AppEntry() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  );
}
