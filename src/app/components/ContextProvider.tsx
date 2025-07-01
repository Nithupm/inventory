import { createContext, useState, ReactNode } from "react";
import type { Item } from "../../types";

type InventoryContextType = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  activeEventId: string;
  setActiveEventId: React.Dispatch<React.SetStateAction<string>>;
};

export const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [activeEventId, setActiveEventId] = useState("");

  return (
    <InventoryContext.Provider
      value={{ items, setItems, activeEventId, setActiveEventId }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
