import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { login } from '../../services/auth';
import { ILoggedUser } from '../../common/interfaces';
import { toaster } from '../../components/ui/toaster';
import { LuUser } from 'react-icons/lu';
import { IoKeyOutline } from 'react-icons/io5';
import { Box, Flex, Text, Input, Group, InputAddon } from '@chakra-ui/react';
import { Field } from '../../components/ui/field';
import { PasswordInput } from '../../components/ui/password-input';
import { Button } from '../../components/ui/button';

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await login(data);

      if (res.status === 200) {
        const loggedUser: ILoggedUser = res.data;
        localStorage.setItem('accessToken', loggedUser.accessToken);
        localStorage.setItem('userRole', JSON.stringify(loggedUser.userRole));
        localStorage.setItem('userID', loggedUser.id.toString());

        if (loggedUser.userRole.name === 'DONOR') {
          localStorage.setItem('user', JSON.stringify(loggedUser.user));
        }

        if (loggedUser.userRole.code === 'ADMIN') {
          navigate('/admin-dashboard');
          return;
        }
        toaster.create({
          description: 'Login successful!',
          type: 'success',
        });
        navigate('/');
      }
    } catch (error) {
      toaster.create({
        description: 'Invalid email or password',
        type: 'error',
      });
    }
  };
  return (
    <Flex alignItems="center" flexDir="column" w="full" h="full">
      <Text
        color="brand.600"
        fontSize="lg"
        md={{ fontSize: '2xl' }}
        fontWeight="bold"
      >
        Sign In to Donate
      </Text>
      <Box w="full" mt={8} flexGrow={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDir="column" gap={5}>
            <Field label="Email">
              <Group w="full" attached>
                <InputAddon bg="brand.600">
                  <LuUser color="white" />
                </InputAddon>
                <Input
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  {...register('username', {
                    required: 'Email is required',
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: 'Invalid email address',
                    },
                  })}
                  outlineColor="brand.400"
                />
              </Group>
              <Text fontSize="xs" color="red.600">
                {errors.username && errors.username.message}
              </Text>
            </Field>
            <Field label="Password">
              <Group w="full" attached>
                <InputAddon bg="brand.600">
                  <IoKeyOutline color="white" />
                </InputAddon>
                <PasswordInput
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                  })}
                  outlineColor="brand.400"
                />
              </Group>
              <Text fontSize="xs" color="red.600">
                {errors.password && errors.password.message}
              </Text>
            </Field>
            <Button
              loading={isSubmitting}
              colorPalette="brand"
              type="submit"
              width="full"
              mt={3}
            >
              Login
            </Button>
            <Flex justify="center" alignItems="center" gap={1} mt={6}>
              <Text fontSize="sm">Don't you have an account?</Text>
              <Text
                fontSize="sm"
                color="brand.600"
                textDecor="underline"
                cursor="pointer"
                fontWeight="bold"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Text>
            </Flex>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
