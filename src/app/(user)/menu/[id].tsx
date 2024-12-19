import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import products, { defaultPizzaImage } from '@/assets/data/products';
import Button from '@/src/components/Button';
import { useCart } from '@/src/providers/CartProvider';
import { IPizzaSize } from '@/src/types';

const sizes: IPizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState<IPizzaSize>('M');
  const { addItem } = useCart();
  const router = useRouter();

  const product = products.find((product) => product.id.toString() === id);
  if (!product) {
    return <Text>Product not found</Text>;
  }

  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem(product, selectedSize);
    router.push('/cart');
  };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text>Select Size</Text>
      <View style={styles.sizes}>
        {sizes.map((s) => (
          <Pressable
            onPress={() => setSelectedSize(s)}
            key={s}
            style={[
              styles.size,
              { backgroundColor: selectedSize === s ? 'gainsboro' : 'white' },
            ]}
          >
            <Text
              style={[
                styles.sizeText,
                { color: selectedSize === s ? 'black' : 'gray' },
              ]}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>${product.price}</Text>
      <Button text='checkout' onPress={addToCart} />
    </View>
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
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    aspectRatio: 1,
    // backgroundColor: 'gainsboro',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sizeText: { fontSize: 20, fontWeight: '500' },
});
