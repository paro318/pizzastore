import products from '@/assets/data/products';
import { ProductListItem } from '@/src/components/ProductListItem';

export default function TabOneScreen() {
  return (
    <>
      <ProductListItem product={products[1]} />
    </>
  );
}
