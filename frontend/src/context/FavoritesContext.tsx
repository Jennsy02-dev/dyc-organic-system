import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadUserFavorites = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('favorites')
      .select('products(*)')
      .eq('user_id', user.id);

    if (!error && data) {
      const prods = data.map((item: any) => item.products).filter(Boolean);
      setFavorites(prods);
    }
  };

  const toggleFavorite = async (product: Product) => {
    const exists = favorites.some((fav) => fav.id === product.id);

    if (user) {
      if (exists) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
      } else {
        await supabase
          .from('favorites')
          .insert([{ user_id: user.id, product_id: product.id }]);
      }
    }

    setFavorites((prev) =>
      exists ? prev.filter((p) => p.id !== product.id) : [...prev, product]
    );
  };

  const isFavorite = (productId: string) => favorites.some((p) => p.id === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  return context;
};