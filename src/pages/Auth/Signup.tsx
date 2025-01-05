import React from 'react';
import { toaster } from '../../components/ui/toaster';
import { SignupFormInputs, SignupPayload } from '../../common/interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/auth';
import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react';
import { Field } from '../../components/ui/field';
import { PasswordInput } from '../../components/ui/password-input';
import { Button } from '../../components/ui/button';

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      const payload: SignupPayload = {
        fName: data.fName,
        lName: data.lName,
        email: data.email,
        address: data.address,
        nic: data.nic,
        mobile: data.mobile,
        password: data.password,
      };

      const res = await signup(payload);

      if (res) {
        toaster.create({
          description: 'Signed up successfully',
          type: 'success',
        });
        navigate('/login');
      }
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const password = watch('password');
  return (
    <Flex alignItems="center" flexDir="column" w="full" h="full">
      <Text
        color="brand.600"
        fontSize="lg"
        md={{ fontSize: '2xl' }}
        fontWeight="bold"
      >
        Sign Up
      </Text>
      <Box w="full" mt={4} flexGrow={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
            <Field label="First Name">
              <Input
                id="fName"
                placeholder="John Doe"
                {...register('fName', {
                  required: 'First Name is required',
                  minLength: {
                    value: 3,
                    message: 'First Name must be at least 3 characters long',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.fName && errors.fName.message}
              </Text>
            </Field>
            <Field label="Last Name">
              <Input
                id="lName"
                placeholder="John Doe"
                {...register('lName', {
                  required: 'Last Name is required',
                  minLength: {
                    value: 3,
                    message: 'Last Name must be at least 3 characters long',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.lName && errors.lName.message}
              </Text>
            </Field>
            <Field label="Email">
              <Input
                id="email"
                type="email"
                placeholder="me@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.email && errors.email.message}
              </Text>
            </Field>
            <Field label="NIC">
              <Input
                id="nic"
                placeholder="123456789V"
                {...register('nic', {
                  required: 'NIC is required',
                  pattern: {
                    value: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/,
                    message: 'Invalid NIC format',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.nic && errors.nic.message}
              </Text>
            </Field>
            <Field label="Address">
              <Input
                id="address"
                placeholder="123 Main Street"
                {...register('address', {
                  required: 'Address is required',
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.address && errors.address.message}
              </Text>
            </Field>
            <Field label="Mobile">
              <Input
                id="mobile"
                type="tel"
                placeholder="0712345678"
                {...register('mobile', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Invalid mobile number format',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.mobile && errors.mobile.message}
              </Text>
            </Field>
            <Field label="Password">
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.password && errors.password.message}
              </Text>
            </Field>
            <Field label="Confirm Password">
              <PasswordInput
                id="confirmPassword"
                placeholder="Re-enter your password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
              <Text fontSize="xs" color="red.600">
                {errors.confirmPassword && errors.confirmPassword.message}
              </Text>
            </Field>
          </Grid>
          <Button
            loading={isSubmitting}
            colorPalette="brand"
            type="submit"
            width="full"
            mt={4}
          >
            Sign Up
          </Button>
          <Flex justify="center" alignItems="center" gap={1} mt={3}>
            <Text fontSize="sm">Already have an account?</Text>
            <Text
              fontSize="sm"
              color="brand.600"
              textDecor="underline"
              cursor="pointer"
              fontWeight="bold"
              onClick={() => navigate('/login')}
            >
              Login
            </Text>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default Signup;
