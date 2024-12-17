import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen options={{ title: 'Details' + id }} />
      <Text>ProductDetailScreen id : {id}</Text>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({});
