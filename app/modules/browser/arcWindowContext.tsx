import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ArcWindow } from "../../models/ArcWindow";

// @ts-ignore
export const ArcWindowContext = createContext<ArcWindow>();

export const ArcWindowProvider: React.FC<PropsWithChildren<{ arcWindow: ArcWindow }>> = (props) => {
  const { children, arcWindow } = props;
  return <ArcWindowContext.Provider value={arcWindow}>{children}</ArcWindowContext.Provider>;
};

export const useArcWindow = () => useContext(ArcWindowContext);
