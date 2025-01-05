import React from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';

const About = () => {
  return (
    <Flex position="relative" h="full">
      <Image
        w={'full'}
        h={'inherit'}
        objectFit={'cover'}
        src="/assets/about-cover.jpg"
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
            About
          </Text>
          <Text textStyle={'4xl'} color="brand.400" fontWeight={'bold'} ms={2}>
            Us
          </Text>
        </Flex>
        <Text textStyle={'lg'} px={4} textAlign={'center'} color={'gray.200'}>
          Welcome to Care-Connect! We are dedicated to making a big difference
          with small efforts. Our mission is to connect donors with impactful
          causes and provide a platform for creating positive change in the
          community.
        </Text>
        <Text textStyle={'lg'} px={4} textAlign={'center'} color={'gray.200'}>
          Thank you for being a part of our journey to make the world a better
          place
        </Text>
        <Flex
          w={'98%'}
          justify={'center'}
          alignItems={'center'}
          flexDir={'column'}
          p={6}
          borderRadius={'md'}
          mt={8}
          gap={2}
        >
          <Flex gap={1}>
            <Text textStyle={'xl'} color="gray.200">
              The Best way
            </Text>
            <Text textStyle={'xl'} color="brand.400" fontWeight={'bold'}>
              to Multiply
            </Text>
            <Text textStyle={'xl'} color="gray.200">
              Your Happiness
            </Text>
            <Text textStyle={'xl'} color="brand.400" fontWeight={'bold'}>
              is to Share it
            </Text>
            <Text textStyle={'xl'} color="gray.200">
              With Others
            </Text>
          </Flex>
          <Image
            mt={8}
            w={'fit'}
            h={44}
            src="/assets/hearts.png"
            alt="hearts"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default About;
