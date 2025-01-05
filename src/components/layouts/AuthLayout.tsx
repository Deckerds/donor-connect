import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Center, Flex, Spinner } from '@chakra-ui/react';
import { scrollBarCss } from '../../common/css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toaster } from '../ui/toaster';

interface AuthLayoutProps {
  children: ReactNode;
  width?: string;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children, width }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('accessToken');
    setIsAuthenticated(isAuth === 'true');
  }, []);

  useEffect(() => {
    if (isAuthenticated && location.pathname !== '/') {
      toaster.create({
        description: 'Already logged in',
        type: 'info',
      });
      navigate('/');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  if (isAuthenticated === null) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isAuthenticated) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center
      backgroundImage="linear-gradient(to bottom, rgba(241, 245, 249, 0.7), rgba(241, 245, 249, 0.9)), url(/assets/auth-cover.jpg)"
      backgroundSize="cover"
      backgroundPosition="center"
      height="100vh"
      p={5}
    >
      <Flex
        justify="center"
        background="white"
        w={width ? width : '30rem'}
        md={{ minW: '30rem' }}
        minH="30rem"
        borderRadius="2xl"
        shadow="md"
        py={5}
        px={8}
        overflowY="auto"
        maxH="100%"
        css={scrollBarCss}
      >
        {children}
      </Flex>
    </Center>
  );
};

export default AuthLayout;
