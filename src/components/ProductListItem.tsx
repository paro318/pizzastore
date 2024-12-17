import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { IProduct } from '../types';
import { defaultPizzaImage } from '@/assets/data/products';
import { Link } from 'expo-router';
import Colors from '../constants/Colors';

type ProductListItemProps = {
  product: IProduct;
};
export const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <Link href={`/(tabs)/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: product.image || defaultPizzaImage }}
          style={styles.image}
          resizeMode='contain'
          onError={() => console.log('Image failed to load')} // Log if the image fails to load
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    maxWidth: '50%',
    padding: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});
