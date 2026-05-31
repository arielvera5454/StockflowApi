export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  priceAtOrder: number;
}

export interface OrderResponse {
  id: number;
  operatorId: number;
  status: string;
  createdAt: Date;
  items: OrderItemResponse[];
}

export interface UpdateStatusInput {
  status: 'DISPATCHED' | 'CANCELLED';
}