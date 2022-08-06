import React, {useEffect, useState} from 'react';
import {
  Button,
  Input,
  Stack,
  FormControl,
  Icon,
  KeyboardAvoidingView,
  Text,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';
import FormErrorMessage from '@components/Elements/FormErrorMessage';
import LoginSchema from '@shared/constants/loginSchema';
import useSignIn from '@shared/api/auth/useLogin';
import {useNavigation} from '@react-navigation/native';
import {LoginScreenProps} from '@navigation/AuthStack';
import useSendVerifyCodeEmail from '@shared/api/auth/useSendVerifyCodeEmail';
import {useDispatch} from 'react-redux';
import {setUser} from '@redux/slices/user';

export default function LoginScreenForm() {
  const [passShowing, setPassShowing] = useState<boolean>(false);
  const onPassToggle = () => setPassShowing(!passShowing);
  const [signIn, {data, loading, error}] = useSignIn();
  const [isloading, setLoading] = useState<boolean>(false);
  const navigation: LoginScreenProps['navigation'] = useNavigation();
  const [sendCode] = useSendVerifyCodeEmail();
  const dispatch = useDispatch();

  const handleLogin = async (values: {
    Identifier: string;
    Password: string;
  }) => {
    try {
      setLoading(true);
      await signIn({
        variables: {
          identifier: values.Identifier,
          password: values.Password,
        },
      });
    } catch {}
  };

  useEffect(() => {
    if (data && data.signIn && !loading) {
      if (data.signIn.user.isEmailVerified) {
        dispatch(setUser(data.signIn));
      } else {
        async function sendEmailCode() {
          await sendCode({variables: {email: data.signIn.user.email}}).then(
            () => {
              navigation.navigate('auth:verify', {
                email: data.signIn.user.email,
              });
            },
          );
        }
        sendEmailCode();
      }
      setLoading(false);
    }
  }, [data, navigation]);
  return (
    <Formik
      initialValues={{
        Identifier: '',
        Password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={values => handleLogin(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <Stack space={2}>
          <FormControl>
            <FormErrorMessage isInvalid={!!error}>
              {error?.graphQLErrors[0]?.message}
            </FormErrorMessage>
          </FormControl>

          <KeyboardAvoidingView>
            <FormControl>
              <Input
                onBlur={handleBlur('Identifier')}
                placeholder="Email or username"
                borderBottomWidth="1"
                value={values.Identifier}
                onChangeText={handleChange('Identifier')}
              />
              <FormErrorMessage
                isInvalid={!!errors.Identifier && touched.Identifier}>
                {errors.Identifier}
              </FormErrorMessage>
            </FormControl>
          </KeyboardAvoidingView>
          <KeyboardAvoidingView>
            <FormControl>
              <Input
                onBlur={handleBlur('Password')}
                type={passShowing ? 'text' : 'password'}
                placeholder="Password"
                borderBottomWidth="1"
                value={values.Password}
                onChangeText={handleChange('Password')}
                InputRightElement={
                  <Button
                    bg="primary"
                    h="100%"
                    borderRadius="0"
                    onPress={onPassToggle}>
                    <Icon
                      color="white"
                      as={Feather}
                      name={passShowing ? 'eye-off' : 'eye'}
                    />
                  </Button>
                }
              />
              <FormErrorMessage
                isInvalid={!!errors.Password && touched.Password}>
                {errors.Password}
              </FormErrorMessage>
            </FormControl>
          </KeyboardAvoidingView>

          <Button
            onPress={() => navigation.navigate('auth:resetPassword')}
            alignSelf="flex-end">
            <Text color="primary">Forgot Password ?</Text>
          </Button>
          <Button
            isLoading={isloading && !error}
            bg="primary"
            _text={{color: 'invert'}}
            onPress={handleSubmit}>
            Login
          </Button>
        </Stack>
      )}
    </Formik>
  );
}
