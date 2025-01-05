import { Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { Button } from './ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const donateNav = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userID');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Flex
      position={'sticky'}
      justify={'space-around'}
      alignItems={'center'}
      left={0}
      top={0}
      py={4}
      px={4}
      h={20}
      shadow={'md'}
    >
      <Flex alignItems={'center'} gap={4}>
        <Text
          onClick={() => navigate('/')}
          textStyle={'sm'}
          fontWeight={location.pathname === '/' ? 'bold' : 'normal'}
          color="brand.600"
          cursor={'pointer'}
          _hover={{ textDecor: 'underline' }}
        >
          Home
        </Text>
        <Text
          onClick={() => navigate('/contact-us')}
          textStyle={'sm'}
          fontWeight={location.pathname === '/contact-us' ? 'bold' : 'normal'}
          color="brand.600"
          cursor={'pointer'}
          _hover={{ textDecor: 'underline' }}
        >
          Contact us
        </Text>
        <Text
          onClick={() => navigate('/about-us')}
          textStyle={'sm'}
          fontWeight={location.pathname === '/about-us' ? 'bold' : 'normal'}
          color="brand.600"
          cursor={'pointer'}
          _hover={{ textDecor: 'underline' }}
        >
          About us
        </Text>
      </Flex>
      <Flex gap={2}>
        <Image
          w={32}
          h={32}
          objectFit="contain"
          src="/assets/logo.png"
          alt="logo"
        />
      </Flex>
      <Flex alignItems={'center'} gap={4}>
        {!isAuthenticated && (
          <React.Fragment>
            <Button
              onClick={() => navigate('/login')}
              variant={'outline'}
              fontSize={'xs'}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant={'outline'}
              fontSize={'xs'}
            >
              Sign up
            </Button>
          </React.Fragment>
        )}
        {isAuthenticated && (
          <React.Fragment>
            <Text
              onClick={() => donateNav('/user-donate')}
              textStyle={'sm'}
              fontWeight={
                location.pathname === '/user-donate' ? 'bold' : 'normal'
              }
              color="brand.600"
              cursor={'pointer'}
              _hover={{ textDecor: 'underline' }}
            >
              Donate
            </Text>
            <Text
              onClick={() => donateNav('/user-donations')}
              textStyle={'sm'}
              fontWeight={
                location.pathname === '/user-donations' ? 'bold' : 'normal'
              }
              color="brand.600"
              cursor={'pointer'}
              _hover={{ textDecor: 'underline' }}
            >
              Your donations
            </Text>
            <Button
              onClick={() => logout()}
              variant={'outline'}
              fontSize={'xs'}
            >
              Logout
            </Button>
          </React.Fragment>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
