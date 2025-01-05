import React, { FC, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ICreateDonation, IDonation } from '../../../common/interfaces';
import { Box, Grid, Input, Text } from '@chakra-ui/react';
import { Field } from '../../../components/ui/field';
import { Button } from '../../../components/ui/button';
import { toaster } from '../../../components/ui/toaster';
import {
  createDonation,
  getDonation,
  updateDonation,
} from '../../../services/admin';
import { Switch } from '../../../components/ui/switch';

interface IDonationForm {
  getData: () => void;
  donationID?: number;
}

const DonationForm: FC<IDonationForm> = ({ getData, donationID }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ICreateDonation>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<ICreateDonation> = async (data) => {
    try {
      if (donationID) {
        const res = await updateDonation(data, donationID!);

        if (res.status === 200) {
          toaster.create({
            description: 'Donation item update successful!',
            type: 'success',
          });
        }
      } else {
        await createDonation(data);

        toaster.create({
          description: 'Donation item creation successful!',
          type: 'success',
        });
        reset();
      }
      getData();
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const getSingleDonation = async (
    id: number,
  ): Promise<ICreateDonation | undefined> => {
    try {
      const res = await getDonation(id);

      const donationData: IDonation = res.data;

      return {
        ...donationData,
      };
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (donationID) {
      (async () => {
        const data = await getSingleDonation(donationID);
        reset(data);
      })();
    }
  }, [donationID, reset]);

  return (
    <Box w="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
          <Field label="Name">
            <Input
              id="name"
              placeholder="Breakfast"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters long',
                },
              })}
            />
            <Text fontSize="xs" color="red.600">
              {errors.name && errors.name.message}
            </Text>
          </Field>
          <Field label="Description">
            <Input
              id="description"
              placeholder="Description"
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 3,
                  message: 'Description must be at least 3 characters long',
                },
              })}
            />
            <Text fontSize="xs" color="red.600">
              {errors.description && errors.description.message}
            </Text>
          </Field>
          <Controller
            name="isPerDay"
            control={control}
            render={({ field }) => (
              <Switch
                colorPalette="green"
                name={field.name}
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                inputProps={{ onBlur: field.onBlur }}
              >
                Is per day?
              </Switch>
            )}
          />
        </Grid>
        <Button
          loading={isSubmitting}
          colorPalette="brand"
          type="submit"
          width="full"
          mt={4}
        >
          {donationID ? 'Update Donation' : 'Create Donation'}
        </Button>
      </form>
    </Box>
  );
};

export default DonationForm;
