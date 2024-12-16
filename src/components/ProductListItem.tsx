import { Image, StyleSheet, Text, View } from 'react-native';
import { IProduct } from '../types';
import { defaultPizzaImage } from '@/assets/data/products';

type ProductListItemProps = {
  product: IProduct;
};
export const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
        onError={() => console.log('Image failed to load')} // Log if the image fails to load
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
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
  },
});
