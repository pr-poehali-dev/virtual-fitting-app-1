import { createContext, useContext, useState, ReactNode } from "react";

export interface ScannedProduct {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  marketplace: string;
  url: string;
  addedAt: Date;
  fit?: string;
  favorited: boolean;
}

interface AppContextValue {
  scannedProducts: ScannedProduct[];
  addProduct: (p: Omit<ScannedProduct, "id" | "addedAt" | "favorited">) => void;
  toggleFavorite: (id: string) => void;
  removeProduct: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);

  const addProduct = (p: Omit<ScannedProduct, "id" | "addedAt" | "favorited">) => {
    const product: ScannedProduct = {
      ...p,
      id: crypto.randomUUID(),
      addedAt: new Date(),
      favorited: false,
    };
    setScannedProducts(prev => [product, ...prev]);
  };

  const toggleFavorite = (id: string) => {
    setScannedProducts(prev =>
      prev.map(p => p.id === id ? { ...p, favorited: !p.favorited } : p)
    );
  };

  const removeProduct = (id: string) => {
    setScannedProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{ scannedProducts, addProduct, toggleFavorite, removeProduct }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
