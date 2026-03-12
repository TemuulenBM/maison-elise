export interface Product {
  id: string;
  name: string;
  edition: string;
  price: number;
  image: string;
  colors: ProductColor[];
  category: string;
  description?: string;
  details?: string;
  materials?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Category {
  name: string;
  subcategories: string[];
}
