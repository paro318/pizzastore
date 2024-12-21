import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { ICartItem, Tables } from '../types';
import { randomUUID } from 'expo-crypto';
import { useInsertOrder } from '../api/orders';
import { useRouter } from 'expo-router';
import { useInsertOrderItems } from '../api/order-items';

type ICartContext = {
  items: ICartItem[];
  addItem: (product: Tables<'products'>, size: ICartItem['size']) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

const CartContext = createContext<ICartContext>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<ICartItem[]>([]);
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const router = useRouter();

  const addItem = (product: Tables<'products'>, size: ICartItem['size']) => {
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
  // console.log('ITEMS', items);

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

  const clearCart = () => setItems([]);
  const checkout = () => {
    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (order: Tables<'orders'>) => {
    console.log('ITEMS TO BE SAVED for order', order);

    const orderItems = items.map((cartItems) => ({
      order_id: order.id,
      product_id: cartItems.product_id,
      quantity: cartItems.quantity,
      size: cartItems.size,
    }));
    insertOrderItems(orderItems, {
      onSuccess() {
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
  };
  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => {
  return useContext(CartContext);
};
