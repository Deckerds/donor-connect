import React, { useCallback, useEffect, useRef, useState } from 'react';
import Pagination from '../../components/Pagination';
import { Box, Flex, HStack, Input, Table, Text } from '@chakra-ui/react';
import { scrollBarCss } from '../../common/css';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { debounce } from 'lodash';
import { changeUserStatus, getDonors } from '../../services/admin';
import { Donor, IStatusPayload } from '../../common/interfaces';
import ConfirmDialog from '../../components/ConfirmDialog';
import { toaster } from '../../components/ui/toaster';

const Donors = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [selectedUser, setSelectedUser] = useState<Donor | null>(null);
  const [openToggleConfirm, setOpenToggleConfirm] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminDonors', searchTerm, page, pageSize],
    queryFn: () => getDonors(page - 1, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: (data: IStatusPayload) => changeUserStatus(data),
    onSuccess: () => {
      toaster.create({
        description: 'Status updated successfully!',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['adminDonors'] });
      toggleStatusDialog();
    },
    onError: () => {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    },
  });

  const debounceOnSearch = useRef(
    debounce((value) => setSearchTerm(value), 500),
  ).current;

  useEffect(() => {
    return () => {
      debounceOnSearch.cancel();
    };
  }, [debounceOnSearch]);

  const handleSearchDisplayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchDisplay(value);
      debounceOnSearch(value);
    },
    [debounceOnSearch],
  );

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const toggleStatusDialog = () => {
    setOpenToggleConfirm((prev) => !prev);
  };

  const onToggleStatus = () => {
    if (selectedUser) {
      mutation.mutate({
        id: selectedUser.id,
        status: selectedUser.isActive ? false : true,
      });
    }
  };

  return (
    <Box lgDown={{ p: 5 }} px={10} py={5}>
      <HStack my={5}>
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
      </HStack>
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
                <Table.ColumnHeader fontWeight="bold">
                  First Name
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Last Name
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Address
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">Email</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">NIC</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Mobile
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Active
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.content?.map((item: Donor) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.fname || ''}</Table.Cell>
                  <Table.Cell>{item.lname || ''}</Table.Cell>
                  <Table.Cell>{item.address || ''}</Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.nic || ''}</Table.Cell>
                  <Table.Cell>{item.mobile || ''}</Table.Cell>
                  <Table.Cell
                    fontWeight="bold"
                    color={item?.isActive ? 'green.600' : 'red.600'}
                  >
                    {item?.isActive ? 'Active' : 'Inactive'}
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      onClick={() => {
                        setSelectedUser(item);
                        toggleStatusDialog();
                      }}
                      color="brand.600"
                      textDecor="underline"
                      cursor="pointer"
                    >
                      Toggle Status
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
      {isSuccess && data?.data?.totalPages > 0 && (
        <Flex justifyContent={'end'} mt={2}>
          <Pagination
            handlePageClick={handlePageClick}
            total={Math.ceil(data?.data?.totalElements / pageSize)}
          />
        </Flex>
      )}
      <ConfirmDialog
        open={openToggleConfirm}
        title="Delete User"
        message="Are you sure you want to change user status?"
        cancel={toggleStatusDialog}
        confirm={() => onToggleStatus()}
        submitBtn
      />
    </Box>
  );
};

export default Donors;
