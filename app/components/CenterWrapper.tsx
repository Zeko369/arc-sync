import { PropsWithChildren } from "react";
import { View } from "react-native";

export const CenterWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {children}
    </View>
  );
};
