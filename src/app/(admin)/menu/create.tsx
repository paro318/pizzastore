import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import Button from '@/src/components/Button';
import { defaultPizzaImage } from '@/assets/data/products';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';

const CreateProductScreen = () => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [errors, setErrors] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

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
  const onCreate = () => {
    if (!validateInput()) {
      return;
    }

    console.warn('cresting');

    resetFields();
  };

  const resetFields = () => {
    setPrice('');
    setName('');
  };
  return (
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
      <Button text='create' onPress={onCreate} />
    </View>
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
