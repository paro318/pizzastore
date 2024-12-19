import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { ICartItem, IProduct } from '../types';
import { randomUUID } from 'expo-crypto';

type ICartContext = {
  items: ICartItem[];
  addItem: (product: IProduct, size: ICartItem['size']) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
};

const CartContext = createContext<ICartContext>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<ICartItem[]>([]);

  const addItem = (product: IProduct, size: ICartItem['size']) => {
    // if already in cart then increment quantity
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    // console.log(product, size);
    const newCartItem: ICartItem = {
      product,
      size,
      quantity: 1,
      product_id: product.id,
      id: randomUUID(),
    };
    setItems((prev) => [...prev, newCartItem]);
  };
  console.log('ITEMS', items);

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItem = items.map((item) =>
      item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }
    );

    setItems((prev) => updatedItem.filter((item) => item.quantity > 0));
  };

  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => {
  return useContext(CartContext);
};
