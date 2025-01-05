import React, { useMemo, useState } from 'react';
import {
  DonationItem,
  ICreateDonationForm,
  IDonation,
  IDonorItem,
} from '../../common/interfaces';
import {
  Box,
  createListCollection,
  Flex,
  Grid,
  Input,
  SelectLabel,
  Text,
} from '@chakra-ui/react';
import { Field } from '../../components/ui/field';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../../components/ui/select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addDonation,
  getDonationHistory,
  getDonationTypes,
} from '../../services/donor';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import {
  NumberInputField,
  NumberInputRoot,
} from '../../components/ui/number-input';
import { toaster } from '../../components/ui/toaster';
import { FaPlus } from 'react-icons/fa6';

const UserDonationForm = () => {
  const { getUser } = useAuth();
  const queryClient = useQueryClient();
  const currentUser = getUser();

  const [purpose, setPurpose] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [prevScheduledDate, setPrevScheduledDate] = useState<string>('');
  const [donationItem, setDonationItem] = useState<string[] | undefined>(
    undefined,
  );
  const [validationMessage, setValidationMessage] = useState<string>('');

  const [selectedDonationItem, setSelectedDonationItem] = useState<IDonation>();
  const [itemName, setItemName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const [openValidation, setOpenValidation] = useState<boolean>(false);
  const [openClearForm, setOpenClearForm] = useState<boolean>(false);

  const [donationItems, setDonationItems] = useState<IDonorItem[]>([]);

  const { data, isSuccess } = useQuery({
    queryKey: ['userDonationTypes'],
    queryFn: () => getDonationTypes(),
  });

  const { data: donationHistory } = useQuery({
    queryKey: ['donationHistory'],
    queryFn: () => getDonationHistory(),
  });

  const donationTypes = useMemo(() => {
    if (isSuccess) {
      return createListCollection({
        items: data.data || [],
        itemToString: (item: IDonation) => item.name,
        itemToValue: (item: IDonation) => item.name,
      });
    }
  }, [isSuccess, data]);

  const onChangeListItem = (item: string[], inputDate?: string) => {
    const dTypes: IDonation[] = data.data;
    const selectedItem = dTypes.find((ele) => ele.name === item[0]);

    if (
      selectedItem?.isPerDay &&
      checkDateConflicts(donationHistory.data, item, inputDate || undefined)
    ) {
      setValidationMessage(
        `This date is already booked for ${item[0]}! Please specify another date.`,
      );
      clearData();
      setScheduledDate('');
      toggleValidation();
    } else {
      setDonationItem(item);
      setSelectedDonationItem(selectedItem);
    }
  };

  const checkDateConflicts = (
    data: any,
    item: string[],
    inputDate?: string,
  ): boolean => {
    const sDate = inputDate || scheduledDate;
    for (const date in data) {
      if (date === sDate) {
        const donations = data[date];
        const conflict = donations.some(
          (donation: DonationItem) => donation.donationTypeName === item![0],
        );
        if (conflict) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  };

  const toggleValidation = () => {
    setOpenValidation((prev) => !prev);
  };

  const toggleClearForm = () => {
    setOpenClearForm((prev) => !prev);
  };

  const createDonation = async () => {
    const payload: ICreateDonationForm = {
      donorId: currentUser.id,
      purpose,
      scheduledDate,
      items: donationItems,
    };

    try {
      await addDonation(payload);
      toaster.create({
        description: 'Donation created successfully!',
        type: 'success',
      });
      setPurpose('');
      setScheduledDate('');
      setDonationItems([]);
      clearData();
      queryClient.invalidateQueries({ queryKey: ['donationHistory'] });
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const clearData = () => {
    setDonationItem([]);
    setAmount('');
    setItemName('');
  };

  const isButtonValid = purpose && scheduledDate && donationItems.length > 0;

  const isAddButtonValid = selectedDonationItem && itemName && amount;

  return (
    <Box h={'full'} px={44} py={12}>
      <Text mb={5} textStyle={'xl'} fontWeight={'bold'}>
        Create Donation
      </Text>
      <Grid templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
        <Field label="Purpose">
          <Input
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            id="purpose"
            placeholder="Type a purpose"
            bg={'white'}
          />
        </Field>
        <Field label="Scheduled Date">
          <Input
            value={scheduledDate}
            onChange={(e) => {
              setPrevScheduledDate(scheduledDate);
              setScheduledDate(e.target.value);
              if (donationItem) {
                toggleClearForm();
              }
            }}
            id="date"
            type="date"
            bg={'white'}
          />
        </Field>
      </Grid>
      <Grid
        mt={3}
        gap={5}
        templateColumns={'repeat(4, 1fr)'}
        alignItems={'flex-end'}
      >
        {donationTypes && donationTypes?.items.length > 0 && (
          <SelectRoot
            disabled={!scheduledDate}
            onValueChange={({ value }) => onChangeListItem(value)}
            value={donationItem}
            outline={'none'}
            collection={donationTypes}
            size="sm"
          >
            <SelectLabel>Select Donation Item</SelectLabel>
            <SelectTrigger clearable>
              <SelectValueText placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {donationTypes.items.map((status) => (
                <SelectItem item={status} key={status.name}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
        <Field disabled={donationItem?.length === 0} label="Description">
          <Input
            h={'36px'}
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            id="itemName"
            bg={'white'}
          />
        </Field>
        <Field disabled={donationItem?.length === 0} label="Amount">
          <NumberInputRoot
            w={'full'}
            value={amount}
            onValueChange={(e) => setAmount(e.value)}
          >
            <NumberInputField h={'36px'} />
          </NumberInputRoot>
        </Field>
        <Flex justify={'flex-end'}>
          <Button
            disabled={!isAddButtonValid}
            w={'50%'}
            h={'36px'}
            variant={'outline'}
            colorPalette={'brand'}
            onClick={() => {
              const isDuplicate = donationItems.some(
                (item) =>
                  item.donationTypeId === selectedDonationItem?.id?.toString(),
              );
              if (isDuplicate) {
                toaster.create({
                  description: 'This donation item is already added!',
                  type: 'error',
                });
                return;
              }

              setDonationItems((prev) => [
                ...prev,
                {
                  donationTypeId: selectedDonationItem?.id?.toString()!,
                  itemName: itemName!,
                  quantity: Number(amount),
                },
              ]);
              setDonationItem([]);
              setItemName('');
              setAmount('');
            }}
          >
            <FaPlus /> Add
          </Button>
        </Flex>
      </Grid>
      <Box
        mt={5}
        maxH="20rem"
        overflowY="auto"
        bg="gray.50"
        p={4}
        borderRadius="md"
        boxShadow="sm"
      >
        {donationItems.length > 0 ? (
          donationItems.map((item, index) => (
            <Grid
              key={index}
              templateColumns={'repeat(4, 1fr)'}
              alignItems="center"
              p={3}
              mb={2}
              bg="white"
              borderRadius="md"
              boxShadow="xs"
            >
              <Text fontWeight="bold">{item.itemName}</Text>
              <Text>{item.quantity}</Text>
              <Text color="gray.500">
                {
                  data.data.find(
                    (ele: IDonation) =>
                      ele.id.toString() === item.donationTypeId,
                  ).name
                }
              </Text>
              <Button
                size="sm"
                variant="ghost"
                colorPalette="red"
                onClick={() => {
                  setDonationItems((prev) =>
                    prev.filter((_, itemIndex) => itemIndex !== index),
                  );
                  toaster.create({
                    description: `${item.itemName} removed successfully!`,
                    type: 'info',
                  });
                }}
              >
                Remove
              </Button>
            </Grid>
          ))
        ) : (
          <Text textAlign="center" color="gray.500">
            No donation items added yet.
          </Text>
        )}
      </Box>
      <Flex mt={3} justify={'flex-end'}>
        <Button
          disabled={!isButtonValid}
          onClick={() => createDonation()}
          colorPalette="brand"
        >
          Create Donation
        </Button>
      </Flex>
      <ConfirmDialog
        open={openValidation}
        title="Warning!"
        message={validationMessage}
        cancel={toggleValidation}
        confirm={() => toggleValidation()}
        submitBtn
        removeCancel
        titleColor="fg.warning"
        btnName="Ok"
      />
      <ConfirmDialog
        open={openClearForm}
        title="Warning!"
        message={'This will clear the form. Continue?'}
        cancel={() => {
          toggleClearForm();
          setScheduledDate(prevScheduledDate);
        }}
        confirm={() => {
          clearData();
          setDonationItems([]);
          toggleClearForm();
        }}
        submitBtn
        titleColor="fg.warning"
        btnName="Confirm"
      />
    </Box>
  );
};

export default UserDonationForm;
