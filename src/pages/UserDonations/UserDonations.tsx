import React, { ChangeEvent, useCallback, useEffect, useRef } from "react";
import { Box, Flex, Grid, HStack, Input, Table, Text } from "@chakra-ui/react";
import { IoSearchOutline } from "react-icons/io5";
import { InputGroup } from "../../components/ui/input-group";
import { debounce } from "lodash";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserDonations } from "../../services/donor";
import { useAuth } from "../../hooks/useAuth";
import { Donation } from "../../common/interfaces";
import { scrollBarCss } from "../../common/css";
import Pagination from "../../components/Pagination";
import { downloadFile } from "../../common/functions";
import { toaster } from "../../components/ui/toaster";
import { downloadPDF } from "../../services/admin";
import { FaEye } from "react-icons/fa6";
import ViewModal from "../../components/ViewModal";

const UserDonations = () => {
  const { getUser } = useAuth();

  const user = getUser();

  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [searchDisplay, setSearchDisplay] = React.useState<string>("");

  const [selectedDonation, setSelectedDonation] =
    React.useState<Donation | null>(null);

  const [page, setPage] = React.useState<number>(1);
  const [pageSize] = React.useState<number>(8);

  const [openViewDialog, setOpenViewModal] = React.useState<boolean>(false);

  const { data, isSuccess } = useQuery({
    queryKey: ["adminDonations", searchTerm, page, pageSize],
    queryFn: () => getUserDonations(page - 1, pageSize, searchTerm, user.id),
    placeholderData: keepPreviousData,
  });

  const debounceOnSearch = useRef(
    debounce((value) => setSearchTerm(value), 500)
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
    [debounceOnSearch]
  );

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  const downloadDonation = async (id: number) => {
    try {
      const res = await downloadPDF(id);

      downloadFile(res);

      toaster.create({
        description: "Document downloaded successfully!",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        description: "Uncaught Error!",
        type: "error",
      });
    }
  };

  const toggleViewDialog = () => {
    setOpenViewModal((prev) => !prev);
  };

  return (
    <Box h="full" px={44} py={12}>
      <Text textStyle={"xl"} fontWeight={"bold"}>
        Your Donations
      </Text>
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
            _focus={{ borderColor: "none", outline: "none" }}
          />
        </InputGroup>
      </HStack>
      <Box h="calc(100vh - 325px)" overflow="hidden">
        <Table.ScrollArea
          borderWidth="1px"
          rounded="md"
          maxH="full"
          maxW={{ mdDown: "fit" }}
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
                  <Table.Cell>{item.donorFirstName || ""}</Table.Cell>
                  <Table.Cell>{item.donorLastName || ""}</Table.Cell>
                  <Table.Cell>{item.donorNic || ""}</Table.Cell>
                  <Table.Cell>{item.purpose}</Table.Cell>
                  <Table.Cell>{item.scheduledDate}</Table.Cell>
                  <Table.Cell>
                    <Box
                      bg={
                        item.status === "COMPLETED"
                          ? "brand.300"
                          : item.status === "PENDING"
                            ? "blue.500"
                            : "red.500"
                      }
                      borderRadius={"md"}
                      p={0.5}
                    >
                      <Text
                        textStyle={"sm"}
                        fontWeight={"bold"}
                        textAlign={"center"}
                        color={"white"}
                      >
                        {item.status}
                      </Text>
                    </Box>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={2}>
                      <Flex
                        justify={"center"}
                        alignItems={"center"}
                        bg="white.100"
                        borderWidth={1}
                        w={"fit"}
                        p={0.5}
                        borderRadius={"md"}
                        cursor={"pointer"}
                        onClick={() => {
                          setSelectedDonation(item);
                          toggleViewDialog();
                        }}
                      >
                        <FaEye />
                      </Flex>
                      <Box
                        py={0.5}
                        px={2}
                        borderWidth={1}
                        borderColor={"gray.500"}
                        borderRadius={"md"}
                        cursor={"pointer"}
                        _hover={{ bg: "gray.100" }}
                        bg={"white"}
                        onClick={() => {
                          downloadDonation(item.id);
                        }}
                      >
                        <Text
                          textStyle={"xs"}
                          textAlign={"center"}
                          fontWeight={"bold"}
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
        <Flex justifyContent={"end"} mt={2}>
          <Pagination
            handlePageClick={handlePageClick}
            total={Math.ceil(data?.data?.totalElements / pageSize)}
          />
        </Flex>
      )}
      <ViewModal
        open={openViewDialog}
        close={() => toggleViewDialog()}
        title="View Donation"
        body={
          selectedDonation ? (
            <Box p={5}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Donation Details
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Box>
                  <Text fontWeight="bold">Donor Name:</Text>
                  <Text>
                    {selectedDonation.donorFirstName}{" "}
                    {selectedDonation.donorLastName}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Donor NIC:</Text>
                  <Text>{selectedDonation.donorNic}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Purpose:</Text>
                  <Text>{selectedDonation.purpose}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Scheduled Date:</Text>
                  <Text>{selectedDonation.scheduledDate}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Status:</Text>
                  <Box
                    w="fit"
                    bg={
                      selectedDonation.status === "COMPLETED"
                        ? "brand.300"
                        : selectedDonation.status === "PENDING"
                          ? "blue.500"
                          : "red.500"
                    }
                    borderRadius={"md"}
                    py={0.5}
                    px={4}
                  >
                    <Text
                      textStyle={"sm"}
                      fontWeight={"bold"}
                      textAlign={"center"}
                      color={"white"}
                    >
                      {selectedDonation.status}
                    </Text>
                  </Box>
                </Box>
              </Grid>

              <Box mt={6}>
                <Text mb={4} fontSize="lg" fontWeight="bold">
                  Donation Items
                </Text>
                {selectedDonation.donationItems.map((item, index) => (
                  <Grid key={index} templateColumns={"repeat(3,1fr)"} mb={3}>
                    <Text fontWeight="bold">{item.donationTypeName}:</Text>
                    <Text>{item.itemName}</Text>
                    <Text>Amount: {item.quantity}</Text>
                  </Grid>
                ))}
              </Box>
            </Box>
          ) : (
            <></>
          )
        }
      />
    </Box>
  );
};

export default UserDonations;
