import { Pressable } from "react-native";

export const Button: React.FC<React.ComponentProps<typeof Pressable>> = (props) => {
  const { children, onPress, ...rest } = props;

  return (
    <Pressable
      onPress={onPress}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      {...rest}
    >
      {children}
    </Pressable>
  );
};
