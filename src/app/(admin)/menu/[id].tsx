import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import products, { defaultPizzaImage } from '@/assets/data/products';
import Button from '@/src/components/Button';
import { useCart } from '@/src/providers/CartProvider';
import { IPizzaSize } from '@/src/types';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useProduct } from '@/src/api/products';

const sizes: IPizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const [selectedSize, setSelectedSize] = useState<IPizzaSize>('M');
  const { addItem } = useCart();
  const router = useRouter();
  const { data: product, error, isLoading } = useProduct(id);

  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem(product, selectedSize);
    router.push('/cart');
  };
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch data</Text>;
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: product?.name || 'Product Details',
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name='pencil'
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <View style={styles.container}>
        <Image
          source={{ uri: product?.image || defaultPizzaImage }}
          style={styles.image}
        />

        <Text style={styles.title}>{product?.name}</Text>
        <Text style={styles.price}>${product?.price}</Text>
      </View>
    </>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  image: { width: '100%', aspectRatio: 1 },
  price: { fontSize: 16, fontWeight: 'bold' },

  sizeText: { fontSize: 18, fontWeight: '500' },
  title: { fontSize: 20, fontWeight: '500' },
});
