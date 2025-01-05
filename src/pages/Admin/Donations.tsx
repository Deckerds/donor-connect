import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Flex, HStack, Input, Table, Text } from '@chakra-ui/react';
import { InputGroup } from '../../components/ui/input-group';
import { IoSearchOutline } from 'react-icons/io5';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  changeDonationStatus,
  downloadPDF,
  getDonations,
} from '../../services/admin';
import { debounce } from 'lodash';
import Pagination from '../../components/Pagination';
import { scrollBarCss } from '../../common/css';
import { Donation, IDonationStatusPayload } from '../../common/interfaces';
import ViewModal from '../../components/ViewModal';
import DonationStatus from './components/DonationStatus';
import { toaster } from '../../components/ui/toaster';
import { downloadFile } from '../../common/functions';

const Donations = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchDisplay, setSearchDisplay] = useState<string>('');

  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null,
  );

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const [openDonation, setOpenDonation] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);

  const { data, isSuccess } = useQuery({
    queryKey: ['adminDonations', searchTerm, page, pageSize],
    queryFn: () => getDonations(page - 1, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: (data: IDonationStatusPayload) => changeDonationStatus(data),
    onSuccess: () => {
      toaster.create({
        description: 'Status updated successfully!',
        type: 'success',
      });
      getDonationData();
      toggleDonationStatus();
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

  const getDonationData = () => {
    queryClient.invalidateQueries({ queryKey: ['adminDonations'] });
  };

  const toggleDonationStatus = () => {
    setOpenDonation((prev) => !prev);
  };

  const updateDonationStatus = () => {
    if (selectedDonation) {
      mutation.mutate({
        id: selectedDonation.id,
        status: selectedStatus[0],
      });
    }
  };

  const downloadDonation = async (id: number) => {
    try {
      const res = await downloadPDF(id);

      downloadFile(res);

      toaster.create({
        description: 'Document downloaded successfully!',
        type: 'success',
      });
    } catch (error) {
      toaster.create({
        description: 'Uncaught Error!',
        type: 'error',
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
            placeholder="Search donations..."
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
                <Table.ColumnHeader fontWeight="bold">NIC</Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Purpose
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Scheduled Date
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="bold">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.content?.map((item: Donation) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.donorFirstName || ''}</Table.Cell>
                  <Table.Cell>{item.donorLastName || ''}</Table.Cell>
                  <Table.Cell>{item.donorNic || ''}</Table.Cell>
                  <Table.Cell>{item.purpose}</Table.Cell>
                  <Table.Cell>{item.scheduledDate}</Table.Cell>
                  <Table.Cell>
                    <Box
                      bg={
                        item.status === 'COMPLETED'
                          ? 'brand.300'
                          : item.status === 'PENDING'
                            ? 'blue.500'
                            : 'red.500'
                      }
                      borderRadius={'md'}
                      p={0.5}
                    >
                      <Text
                        textStyle={'sm'}
                        fontWeight={'bold'}
                        textAlign={'center'}
                        color={'white'}
                      >
                        {item.status}
                      </Text>
                    </Box>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={2}>
                      <Box
                        py={0.5}
                        px={2}
                        borderWidth={1}
                        borderColor={'gray.500'}
                        borderRadius={'md'}
                        cursor={'pointer'}
                        onClick={() => {
                          setSelectedStatus([item.status]);
                          setSelectedDonation(item);
                          toggleDonationStatus();
                        }}
                        _hover={{ bg: 'gray.100' }}
                        bg={'white'}
                      >
                        <Text
                          textStyle={'xs'}
                          textAlign={'center'}
                          fontWeight={'bold'}
                        >
                          Change Status
                        </Text>
                      </Box>
                      <Box
                        py={0.5}
                        px={2}
                        borderWidth={1}
                        borderColor={'gray.500'}
                        borderRadius={'md'}
                        cursor={'pointer'}
                        _hover={{ bg: 'gray.100' }}
                        bg={'white'}
                        onClick={() => {
                          downloadDonation(item.id);
                        }}
                      >
                        <Text
                          textStyle={'xs'}
                          textAlign={'center'}
                          fontWeight={'bold'}
                        >
                          Download Pdf
                        </Text>
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
        body={
          <DonationStatus
            onUpdate={() => updateDonationStatus()}
            value={selectedStatus}
            onChange={setSelectedStatus}
            loading={mutation.isPending}
          />
        }
        open={openDonation}
        close={toggleDonationStatus}
        title="Update Status"
      />
    </Box>
  );
};

export default Donations;
