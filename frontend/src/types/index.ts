export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'capilar' | 'lavado' | 'tratamiento' | 'combos';
  image: string;
  description: string;
  benefits: string[];
  rating: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}