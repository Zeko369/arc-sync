import { Pressable } from "react-native";

export const Button: React.FC<React.ComponentProps<typeof Pressable> & { noColor?: boolean }> = (
  props
) => {
  const { children, onPress, noColor, ...rest } = props;

  return (
    <Pressable
      onPress={onPress}
      className={`${noColor ? "" : "bg-blue-300"} text-white font-bold py-2 px-4 rounded`}
      {...rest}
    >
      {children}
    </Pressable>
  );
};
