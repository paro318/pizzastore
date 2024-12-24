import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { supabase } from '@/src/lib/supabase';

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button
        title='sign out'
        onPress={async () => {
          await supabase.auth.signOut();
        }}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
