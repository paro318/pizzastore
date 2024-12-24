import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '@/src/components/Button';
import { defaultPizzaImage } from '@/assets/data/products';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from '@/src/api/products';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer';

const CreateProductScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [errors, setErrors] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);

  const isUpdating = !!idString;
  const id = parseFloat(
    typeof idString === 'string' ? idString : idString?.[0]
  );

  const { data: updatingProduct } = useProduct(id);
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateInput = () => {
    setErrors('');
    if (!name) {
      setErrors('Name is required');
      return false;
    }
    if (!price) {
      setErrors('Please enter price');
      return false;
    }
    if (parseFloat(price) <= 0) {
      setErrors('Price should be greater than 0');
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors('Price is not a number');
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) return;
    console.warn('uploading image');

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { error, data } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });
    console.warn('image uploaded', data);

    if (data) {
      return data.path;
    }
    if (error) {
      console.log(`error`, error);
      return null;
    }
  };
  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    console.warn('creating');
    const imagePath = await uploadImage();

    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          console.warn('product created');

          resetFields();
          router.back();
        },
      }
    );
  };

  const onUpdate = () => {
    if (!validateInput()) {
      return;
    }
    updateProduct(
      {
        name,
        price,
        image,
        id,
      },
      {
        onSuccess: () => {
          console.log('SUCCESS updating product');
          resetFields();
          router.back();
        },
        onError: () => {
          console.log('NOT SUCCESS updating product');
        },
      }
    );
  };

  const resetFields = () => {
    setPrice('');
    setName('');
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess() {
        resetFields();
        router.replace('/(admin)');
      },
    });
  };
  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };
  return (
    <>
      <Stack.Screen options={{ title: isUpdating ? 'Update' : 'Create' }} />
      <View style={styles.container}>
        <Image
          source={{ uri: image || defaultPizzaImage }}
          style={styles.image}
        />
        <Text onPress={pickImage} style={styles.textButton}>
          select image
        </Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder='Name'
          style={styles.input}
        />

        <Text style={styles.label}>Price(INR)</Text>
        <TextInput
          placeholder='99'
          style={styles.input}
          keyboardType='numeric'
          value={price}
          onChangeText={setPrice}
        />
        <Text style={{ color: 'red', fontStyle: 'italic' }}>{errors}</Text>
        <Button text={isUpdating ? 'Update' : 'Create'} onPress={onSubmit} />
        {isUpdating && (
          <Button
            style={[styles.textButton, { backgroundColor: 'transparent' }]}
            text='Delete Product'
            onPress={confirmDelete}
          />
        )}
      </View>
    </>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
});
