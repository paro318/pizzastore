import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import {
  useQuery,
  QueryClient,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import { Tables, InsertInTables, UpdateInTables } from '../../types';

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived
    ? ['Delivered']
    : ['New', 'Delivered', 'Cooking', 'Delivering'];

  return useQuery({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', statuses)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useMyOrderList = () => {
  const { session } = useAuth();
  const id = session?.user?.id;

  return useQuery({
    queryKey: ['orders', { userId: id }],
    queryFn: async () => {
      if (!id) {
        return null;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const id = session?.user.id;
  return useMutation({
    async mutationFn(data: InsertInTables<'orders'>) {
      const { data: newProduct, error } = await supabase
        .from('orders')
        .insert({ ...data, user_id: id })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      console.log('ORDER CREATED - INSIDE useInsertOrder');
      await queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
    async onError() {
      console.log('ORDER NOT CREATED - INSIDE useInsertOrder');
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateInTables<'orders'>;
    }) {
      //   console.log('DATA TO BE UPDATED', data);
      const { data: updatedOrder, error } = await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', id)
        .select('*')
        .single();

      //   console.log('NEW UPDATED PRODUCT', updatedOrder);
      if (error) {
        console.log('ERROR', error);
        throw new Error(error.message);
      }
      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
};
