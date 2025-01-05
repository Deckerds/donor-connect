import React, { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from '../Header';
import { scrollBarCss } from '../../common/css';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
  return (
    <Flex flexDir="column" bg="secondary.100" height="100vh">
      <Header />
      <Box
        id="scrollableDiv"
        w="full"
        overflowY="auto"
        flexGrow={1}
        css={scrollBarCss}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default HomeLayout;
