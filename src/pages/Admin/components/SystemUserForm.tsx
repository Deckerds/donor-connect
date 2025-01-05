import React, { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  AdminUser,
  CreateUserForm,
  SystemUserFormPayload,
} from '../../../common/interfaces';
import { Box, Grid, Input, Text } from '@chakra-ui/react';
import { Field } from '../../../components/ui/field';
import { Button } from '../../../components/ui/button';
import { PasswordInput } from '../../../components/ui/password-input';
import { toaster } from '../../../components/ui/toaster';
import { createUser, getUser, updateUser } from '../../../services/admin';

interface ISystemUserForm {
  getData: () => void;
  userID?: number;
}

const SystemUserForm: FC<ISystemUserForm> = ({ getData, userID }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SystemUserFormPayload>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<SystemUserFormPayload> = async (data) => {
    try {
      if (userID) {
        const res = await updateUser(data, userID!);

        if (res.status === 200) {
          toaster.create({
            description: 'User update successful!',
            type: 'success',
          });
        }
      } else {
        const res = await createUser(data);

        if (res.status === 200) {
          toaster.create({
            description: 'User creation successful!',
            type: 'success',
          });
          reset();
        }
      }
      getData();
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const getSingleUser = async (
    id: number,
  ): Promise<CreateUserForm | undefined> => {
    try {
      const res = await getUser(id);

      const userData: AdminUser = res.data;

      return {
        fName: userData.fname,
        lName: userData.lname,
        address: '',
        email: userData.email,
        mobile: '',
      };
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (userID) {
      (async () => {
        const data = await getSingleUser(userID);
        reset(data);
      })();
    }
  }, [userID, reset]);

  return (
    <Box w="full">
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
        </Grid>
        <Button
          loading={isSubmitting}
          colorPalette="brand"
          type="submit"
          width="full"
          mt={4}
        >
          {userID ? 'Update User' : 'Create User'}
        </Button>
      </form>
    </Box>
  );
};

export default SystemUserForm;
