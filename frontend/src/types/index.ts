
export interface User {
  id: number;
  email: string;
  name: string;
  isMerchant: boolean;
}

export interface Product {
  id: number;
  title: string;
  sku: string;
  description: string;
  price: number;
  quantity: number;
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
