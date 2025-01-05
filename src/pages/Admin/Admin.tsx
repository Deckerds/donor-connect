import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Flex, HStack, Input, Table } from '@chakra-ui/react';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteUser, getSystemUsers } from '../../services/admin';
import { debounce } from 'lodash';
import Pagination from '../../components/Pagination';
import { scrollBarCss } from '../../common/css';
import { AdminUser } from '../../common/interfaces';
import { Button } from '../../components/ui/button';
import ViewModal from '../../components/ViewModal';
import SystemUserForm from './components/SystemUserForm';
import { MdEdit } from 'react-icons/md';
import { IoMdTrash } from 'react-icons/io';
import ConfirmDialog from '../../components/ConfirmDialog';
import { toaster } from '../../components/ui/toaster';
import { useAuth } from '../../hooks/useAuth';

const Admin = () => {
  const { getUserID } = useAuth();
  const queryClient = useQueryClient();

  const currentUserID = getUserID();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [openViewDialog, setOpenViewModal] = useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateModal] = useState<boolean>(false);
  const [openToggleConfirm, setOpenToggleConfirm] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminUsers', searchTerm, page, pageSize],
    queryFn: () => getSystemUsers(page, pageSize, searchTerm),
    placeholderData: keepPreviousData,
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
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchDisplay(value);
      debounceOnSearch(value);
    },
    [debounceOnSearch],
  );

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const toggleViewDialog = () => {
    setOpenViewModal((prev) => !prev);
  };

  const toggleUpdateDialog = () => {
    setOpenUpdateModal((prev) => !prev);
  };

  const toggleStatusDialog = () => {
    setOpenToggleConfirm((prev) => !prev);
  };

  const onDeleteUser = async () => {
    try {
      await deleteUser(selectedUser?.id!);
      toaster.create({
        description: 'User deleted successfully!',
        type: 'success',
      });
      toggleStatusDialog();
      getUserData();
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
      });
    }
  };

  const getUserData = () => {
    queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
  };

  return (
    <Box lgDown={{ p: 5 }} px={10} py={5}>
      <Flex justifyContent={'end'}>
        <Button onClick={() => toggleViewDialog()} colorPalette={'brand'}>
          Create user
        </Button>
      </Flex>
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
                  Email/Username
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  User Role
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.content?.map((item: AdminUser) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.fname || ''}</Table.Cell>
                  <Table.Cell>{item.lname || ''}</Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.userRole.name}</Table.Cell>
                  <Table.Cell>
                    <Flex gap={2}>
                      <Box
                        pointerEvents={currentUserID === item.id ? 'none' : ''}
                        bg="yellow.300"
                        borderWidth={1}
                        w={'fit'}
                        p={0.5}
                        borderRadius={'md'}
                        cursor={'pointer'}
                        onClick={() => {
                          setSelectedUser(item);
                          toggleUpdateDialog();
                        }}
                        opacity={currentUserID === item.id ? 0.6 : 1}
                      >
                        <MdEdit />
                      </Box>
                      <Box
                        pointerEvents={currentUserID === item.id ? 'none' : ''}
                        bg="red.300"
                        borderWidth={1}
                        w={'fit'}
                        p={0.5}
                        borderRadius={'md'}
                        cursor={'pointer'}
                        onClick={() => {
                          setSelectedUser(item);
                          toggleStatusDialog();
                        }}
                        opacity={currentUserID === item.id ? 0.6 : 1}
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
      {isSuccess && data?.data?.totalPages > 0 && (
        <Flex justifyContent={'end'} mt={2}>
          <Pagination
            handlePageClick={handlePageClick}
            total={Math.ceil(data?.data?.totalElements / pageSize)}
          />
        </Flex>
      )}
      <ViewModal
        open={openViewDialog}
        close={() => toggleViewDialog()}
        title="Create User"
        body={<SystemUserForm getData={() => getUserData()} />}
      />
      <ViewModal
        open={openUpdateDialog}
        close={() => toggleUpdateDialog()}
        title="Update User"
        body={
          <SystemUserForm
            getData={() => getUserData()}
            userID={selectedUser?.id}
          />
        }
      />
      <ConfirmDialog
        open={openToggleConfirm}
        title="Delete User"
        message="Are you sure you want to change delete system user?"
        cancel={toggleStatusDialog}
        confirm={() => onDeleteUser()}
      />
    </Box>
  );
};

export default Admin;
