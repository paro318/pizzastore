import { supabase } from '@/src/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProductList = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: any) {
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          image: data.image,
          price: data.price,
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: any) {
      //   console.log('DATA TO BE UPDATED', data);
      const { data: newProduct, error } = await supabase
        .from('products')
        .update({
          name: data.name,
          image: data.image,
          price: parseFloat(data.price),
        })
        .eq('id', data.id)
        .select('*')
        .single();

      //   console.log('NEW UPDATED PRODUCT', newProduct);
      if (error) {
        console.log('ERROR', error);
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      const {} = await supabase.from('products').delete().eq('id', id);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
