import { useAdminOrderList } from '@/src/api/orders';
import { useInsertOrderSubscription } from '@/src/api/orders/subscriptions';
import OrderListItem from '@/src/components/OrderListItem';
import { ActivityIndicator, FlatList, Text } from 'react-native';

export default function OrderScreen() {
  useInsertOrderSubscription();
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: false });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch orders : {error.message}</Text>;
  }
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
}
