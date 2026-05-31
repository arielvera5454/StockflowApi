export interface CreateProductInput {
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  categoryId: number;
}

export interface UpdateProductInput {
  name?: string;
  stock?: number;
  minStock?: number;
  price?: number;
  categoryId?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
}