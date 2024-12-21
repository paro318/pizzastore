import { supabase } from '@/src/lib/supabase';
import { useMutation } from '@tanstack/react-query';
import { InsertInTables } from '../../types';

export const useInsertOrderItems = () => {
  return useMutation({
    async mutationFn(items: InsertInTables<'order_items'>[]) {
      const { data: newProduct, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      console.log('ORDER ITEMS CREATED');
    },
    async onError() {
      console.log('ORDER ITEMS NOT CREATED');
    },
  });
};
