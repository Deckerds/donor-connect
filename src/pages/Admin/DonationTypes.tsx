import React, { useState } from 'react';
import ViewModal from '../../components/ViewModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Box, Flex, Table } from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';
import { scrollBarCss } from '../../common/css';
import { Button } from '../../components/ui/button';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteDonation, getDonationTypes } from '../../services/admin';
import { IDonation } from '../../common/interfaces';
import { IoMdTrash } from 'react-icons/io';
import DonationForm from './components/DonationForm';
import { toaster } from '../../components/ui/toaster';

const DonationTypes = () => {
  const queryClient = useQueryClient();

  // const [searchTerm, setSearchTerm] = useState<string>('');
  // const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [openViewDialog, setOpenViewModal] = useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateModal] = useState<boolean>(false);
  const [openToggleConfirm, setOpenToggleConfirm] = useState<boolean>(false);

  const [selectedDonation, setSelectedDonation] = useState<IDonation | null>(
    null,
  );

  const { data } = useQuery({
    queryKey: ['donationTypes'],
    queryFn: () => getDonationTypes(),
    placeholderData: keepPreviousData,
  });

  const toggleViewDialog = () => {
    setOpenViewModal((prev) => !prev);
  };

  const toggleUpdateDialog = () => {
    setOpenUpdateModal((prev) => !prev);
  };

  const toggleStatusDialog = () => {
    setOpenToggleConfirm((prev) => !prev);
  };

  const onDeleteDonation = async () => {
    try {
      await deleteDonation(selectedDonation?.id!);
      toaster.create({
        description: 'Donation item deleted successfully!',
        type: 'success',
      });
      toggleStatusDialog();
      getDonationData();
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  // const debounceOnSearch = useRef(
  //   debounce((value) => setSearchTerm(value), 500),
  // ).current;

  // useEffect(() => {
  //   return () => {
  //     debounceOnSearch.cancel();
  //   };
  // }, [debounceOnSearch]);

  // const handleSearchDisplayChange = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value;
  //     setSearchDisplay(value);
  //     debounceOnSearch(value);
  //   },
  //   [debounceOnSearch],
  // );

  const getDonationData = () => {
    queryClient.invalidateQueries({ queryKey: ['donationTypes'] });
  };

  return (
    <Box lgDown={{ p: 5 }} px={10} py={5}>
      <Flex mb={5} justifyContent={'end'}>
        <Button onClick={() => toggleViewDialog()} colorPalette={'brand'}>
          Create donation item
        </Button>
      </Flex>
      {/* <HStack my={5}>
        <InputGroup flex="1" startElement={<IoSearchOutline />}>
          <Input
            id="search"
            name="search"
            placeholder="Search users..."
            value={searchDisplay}
            onChange={handleSearchDisplayChange}
            bg="white"
            borderColor="secondary.200"
            shadow="md"
            _focus={{ borderColor: 'none', outline: 'none' }}
          />
        </InputGroup>
      </HStack> */}
      <Box h="calc(100vh - 350px)" overflow="hidden">
        <Table.ScrollArea
          borderWidth="1px"
          rounded="md"
          maxH="full"
          maxW={{ mdDown: 'fit' }}
          css={scrollBarCss}
        >
          <Table.Root size="md" striped stickyHeader>
            <Table.Header>
              <Table.Row bg="brand.200">
                <Table.ColumnHeader fontWeight="bold">ID</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Name</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Description
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Is Per Day
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.map((item: IDonation) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell
                    fontWeight="bold"
                    color={item?.isActive ? 'green.600' : 'red.600'}
                  >
                    {item?.isActive ? 'Active' : 'Inactive'}
                  </Table.Cell>
                  <Table.Cell
                    fontWeight="bold"
                    color={item?.isPerDay ? 'green.600' : 'red.600'}
                  >
                    {item?.isPerDay ? 'Yes' : 'No'}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={2}>
                      <Box
                        bg="yellow.300"
                        borderWidth={1}
                        w={'fit'}
                        p={0.5}
                        borderRadius={'md'}
                        cursor={'pointer'}
                        onClick={() => {
                          setSelectedDonation(item);
                          toggleUpdateDialog();
                        }}
                      >
                        <MdEdit />
                      </Box>
                      <Box
                        bg="red.300"
                        borderWidth={1}
                        w={'fit'}
                        p={0.5}
                        borderRadius={'md'}
                        cursor={'pointer'}
                        onClick={() => {
                          setSelectedDonation(item);
                          toggleStatusDialog();
                        }}
                      >
                        <IoMdTrash />
                      </Box>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
      {/* {isSuccess && data?.data?.totalPages > 0 && (
        <Flex justifyContent={'end'} mt={2}>
          <Pagination
            handlePageClick={handlePageClick}
            total={Math.ceil(data?.data?.totalElements / pageSize)}
          />
        </Flex>
      )} */}
      <ViewModal
        open={openViewDialog}
        close={() => toggleViewDialog()}
        title="Create User"
        body={<DonationForm getData={() => getDonationData()} />}
      />
      <ViewModal
        open={openUpdateDialog}
        close={() => toggleUpdateDialog()}
        title="Update User"
        body={
          <DonationForm
            getData={() => getDonationData()}
            donationID={selectedDonation?.id}
          />
        }
      />
      <ConfirmDialog
        open={openToggleConfirm}
        title="Delete Donation Item"
        message="Are you sure you want to change delete donation item?"
        cancel={toggleStatusDialog}
        confirm={() => onDeleteDonation()}
      />
    </Box>
  );
};

export default DonationTypes;
