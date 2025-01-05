import React from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const donateNav = () => {
    if (isAuthenticated) {
      navigate('/user-donate');
    } else {
      navigate('/login');
    }
  };
  return (
    <Flex position="relative" h="full">
      <Image
        w={'full'}
        h={'inherit'}
        objectFit={'cover'}
        src="/assets/home-cover.jpg"
        loading="lazy"
      />
      <Flex
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        alignItems="center"
        justifyContent="center"
        flexDir={'column'}
        gap={2}
      >
        <Flex>
          <Text textStyle={'4xl'} color={'white'}>
            Make A Big Difference By
          </Text>
          <Text textStyle={'4xl'} color="brand.400" fontWeight={'bold'} ms={1}>
            Small Thought
          </Text>
        </Flex>
        <Text textStyle={'lg'} color={'gray.200'}>
          We are very much grateful to you for your donation. Your little effort
          helps us to change big community life
        </Text>
        <Flex gap={2}>
          <Button onClick={donateNav} colorPalette={'brand'}>
            Donate Now
          </Button>
          {!isAuthenticated && (
            <Button
              onClick={() => navigate('/signup')}
              variant={'outline'}
              color="white"
              colorPalette={'brand'}
            >
              Become a Volunteer
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
