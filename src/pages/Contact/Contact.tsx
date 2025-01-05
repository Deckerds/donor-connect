import React from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';
import { BsEnvelopeHeartFill, BsFillTelephoneFill } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';

const Contact = () => {
  return (
    <Flex position="relative" h="full">
      <Image
        w={'full'}
        h={'inherit'}
        objectFit={'cover'}
        src="/assets/contact-cover.jpg"
      />
      <Flex
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.8)"
        alignItems="center"
        justifyContent="center"
        flexDir={'column'}
        gap={2}
      >
        <Flex alignItems={'center'}>
          <Text textStyle={'4xl'} color={'white'}>
            Contact
          </Text>
          <Text textStyle={'4xl'} color="brand.400" fontWeight={'bold'} ms={2}>
            Us
          </Text>
        </Flex>
        <Flex
          flexDir={'column'}
          w="fit"
          borderRadius={'md'}
          bg={'white'}
          py={5}
          px={12}
          gap={4}
        >
          <Flex alignItems={'center'} gap={2}>
            <BsEnvelopeHeartFill size={24} color="#016a3a" />
            <Text textStyle={'lg'}>contact@careconnect.com</Text>
          </Flex>
          <Flex alignItems={'center'} gap={2}>
            <BsFillTelephoneFill size={24} color="#016a3a" />
            <Text textStyle={'lg'}>+94 77 123 4567</Text>
          </Flex>
          <Flex alignItems={'center'} gap={2}>
            <FaLocationDot size={24} color="#016a3a" />
            <Text textStyle={'lg'}>Care Connect, Main Road, Rathmalana</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Contact;
