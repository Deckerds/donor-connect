import React, { FC, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { scrollBarCss } from '../../common/css';
import Sidebar from '../Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarVisible((prev) => !prev);
  return (
    <Flex flexDir="column" bg="secondary.100" height="100vh">
      <Flex>
        <Sidebar
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={toggleSidebar}
        />
        <Box
          id="scrollableDiv"
          w="full"
          overflowY="auto"
          flexGrow={1}
          css={scrollBarCss}
          ml={{ md: '300px' }}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
