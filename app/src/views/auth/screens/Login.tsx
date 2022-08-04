import React from 'react';
import {Button, Heading, Input, Stack, View, Text} from 'native-base';
import {AuthScreenProps} from '../../../navigation/type';

export default function LoginScreen({navigation}: AuthScreenProps) {
  return (
    <View h="full" w="full" bg="white" p="5" justifyContent="space-between">
      <Stack space={5}>
        <Heading>Login</Heading>
        <Input
          fontSize="md"
          placeholder="Email ID"
          borderWidth="0"
          borderBottomWidth="1"
        />
        <Input
          fontSize="md"
          placeholder="Password"
          borderWidth="0"
          borderBottomWidth="1"
        />
        <Button>Submit</Button>
      </Stack>
      <Text textAlign="center" fontSize="md" fontWeight={300}>
        Don't have an account yet?{' '}
        <Text
          color="blue.500"
          fontWeight={900}
          onPress={() => navigation.navigate('signup')}>
          Register
        </Text>
      </Text>
    </View>
  );
}
