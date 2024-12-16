export type IProduct = {
  id: number;
  image: string | null;
  name: string;
  price: number;
};

export type IPizzaSize = 'S' | 'M' | 'L' | 'XL';

export type ICartItem = {
  id: string;
  product: IProduct;
  product_id: number;
  size: IPizzaSize;
  quantity: number;
};

export const OrderStatusList: IOrderStatus[] = [
  'New',
  'Cooking',
  'Delivering',
  'Delivered',
];

export type IOrderStatus = 'New' | 'Cooking' | 'Delivering' | 'Delivered';

export type IOrder = {
  id: number;
  created_at: string;
  total: number;
  user_id: string;
  status: IOrderStatus;

  order_items?: IOrderItem[];
};

export type IOrderItem = {
  id: number;
  product_id: number;
  products: IProduct;
  order_id: number;
  size: IPizzaSize;
  quantity: number;
};

export type IProfile = {
  id: string;
  group: string;
};
