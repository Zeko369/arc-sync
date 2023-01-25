import { createContext, PropsWithChildren, useContext } from "react";

const SpaceContext = createContext<{ color: string | null }>({ color: null });
export const SpaceProvider: React.FC<PropsWithChildren<{ color: string | null }>> = (props) => {
  const { children, color } = props;
  return <SpaceContext.Provider value={{ color }}>{children}</SpaceContext.Provider>;
};

export const useSpaceContext = () => useContext(SpaceContext);
