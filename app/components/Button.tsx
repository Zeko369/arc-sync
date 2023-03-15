import { Pressable } from "react-native";

export const Button: React.FC<
  React.ComponentProps<typeof Pressable> & { noColor?: boolean; color?: string }
> = (props) => {
  const { children, onPress, color, noColor, ...rest } = props;

  return (
    <Pressable
      onPress={onPress}
      className={`${noColor ? "" : color || "bg-blue-300"} text-white font-bold py-2 px-4 rounded`}
      {...rest}
    >
      {children}
    </Pressable>
  );
};
