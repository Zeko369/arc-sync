import { useContext, useState } from "react";
import { TextInput, Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";

import { Button } from "../components/Button";
import { AuthContext } from "../modules/auth/context";
import { useRouter } from "expo-router";
import { api } from "../lib/api";

export default function Login() {
  const router = useRouter();
  const ctx = useContext(AuthContext);

  const [email, setEmail] = useState("zekan.fran369@gmail.com");
  const [password, setPassword] = useState("");

  const mutation = useMutation(() =>
    api<{ id: string; token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    })
  );

  const onSubmit = () => {
    mutation
      .mutateAsync()
      .then(ctx.storeUser)
      .then(() => router.push("/"));
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} />

      <Button onPress={onSubmit}>
        <Text>Login</Text>
      </Button>
    </View>
  );
}
