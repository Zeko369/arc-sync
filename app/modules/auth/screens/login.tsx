import { useContext, useEffect, useState } from "react";
import { SafeAreaView, Text, TextInput, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { getItemAsync, setItemAsync } from "expo-secure-store";

import { Button } from "../../../components/Button";
import { api } from "../../../lib/api";
import { AuthContext } from "../authContext";

type InputProps = {
  onChange: (value: string) => void;
  value: string;
  label: string;
  inputProps?: React.ComponentProps<typeof TextInput>;
};

const Input: React.FC<InputProps> = ({ onChange, value, label, inputProps }) => {
  return (
    <View className="mb-4">
      <Text className="text-lg">{label}</Text>
      <TextInput
        className="border border-gray-200 p-4 rounded-xl"
        value={value}
        onChangeText={onChange}
        {...inputProps}
      />
    </View>
  );
};

export const LoginScreen = () => {
  const ctx = useContext(AuthContext);

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState("");

  const mutation = useMutation(() =>
    api<{ id: string; token: string }>("/auth/login", {
      method: "POST",
      body: { email, password }
    })
  );

  const onSubmit = () =>
    mutation
      .mutateAsync()
      .then((data) => Promise.all([ctx.storeUser(data), setItemAsync("AUTH_EMAIL", email!)]));

  useEffect(() => {
    if (email === undefined) {
      getItemAsync("AUTH_EMAIL").then((email) => {
        if (email === null) {
          return setEmail("");
        }

        setEmail(email);
      });
    }
  }, [email]);

  if (email === undefined) {
    return null;
  }

  return (
    <SafeAreaView>
      <View
        className="flex flex-col items-center justify-center"
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <View className="w-full px-10">
          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            inputProps={{
              autoCorrect: false,
              autoCapitalize: "none",
              autoComplete: "email",
              autoFocus: true
            }}
          />
          <Input
            label="Password"
            value={password}
            onChange={setPassword}
            inputProps={{
              autoCorrect: false,
              autoCapitalize: "none",
              autoComplete: "password",
              secureTextEntry: true
            }}
          />
        </View>

        <Button
          onPress={onSubmit}
          className="w-32"
          color={mutation.isLoading ? "bg-blue-200" : "bg-blue-400"}
        >
          <Text className="text-center w-full text-xl">Login</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};
