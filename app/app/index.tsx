import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useAuth } from "../modules/auth/context";
import { Button } from "../components/Button";
import { Browser } from "../modules/browser";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  if (!auth) {
    return (
      <View>
        <Text>Not logged in</Text>
        <Button onPress={() => router.push("/login")}>
          <Text>Login</Text>
        </Button>
      </View>
    );
  }

  return (
    <View>
      <Text>Logged in as {auth.id}</Text>
      <Browser />
    </View>
  );
}
