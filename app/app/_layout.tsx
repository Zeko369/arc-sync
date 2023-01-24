import React, { memo } from "react";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "../modules/auth/context";

const App = memo(() => {
  return (
    <SafeAreaView>
      <Slot />
    </SafeAreaView>
  );
});

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  );
}
