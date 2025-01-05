import { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa6';
import { BiSolidDonateBlood, BiSolidDonateHeart } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoSidebarExpand } from 'react-icons/go';
import { HiUserGroup } from 'react-icons/hi';
import { IoLogOut } from 'react-icons/io5';

interface ISidebarProps {
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
}

const Sidebar: FC<ISidebarProps> = ({ onToggleSidebar, isSidebarVisible }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userID');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Flex
      as="nav"
      flexDir="column"
      zIndex={200}
      position="fixed"
      top={0}
      left={0}
      height="full"
      flexGrow={1}
      width={{ base: isSidebarVisible ? '240px' : '0', md: '300px' }}
      transform={{
        base: isSidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        md: 'translateX(0)',
      }}
      transition="all 0.3s ease-in-out"
      bg="white"
      shadow="md"
      overflow="hidden"
    >
      <Flex justify="center">
        <Flex mt={10} justify="center" flexDir="column" gap={5}>
          <Box hideFrom="md">
            <GoSidebarExpand onClick={() => onToggleSidebar()} />
          </Box>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/admin-dashboard') ? 'brand.100' : 'transparent'}
            color={isActive('/admin-dashboard') ? 'brand.600' : 'inherit'}
            _hover={{ bg: 'brand.100', color: 'brand.600' }}
            onClick={() => navigate('/admin-dashboard')}
          >
            <FaUsers size={24} />
            System Users
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/donation-types') ? 'brand.100' : 'transparent'}
            color={isActive('/donation-types') ? 'brand.600' : 'inherit'}
            _hover={{ bg: 'brand.100', color: 'brand.600' }}
            onClick={() => navigate('/donation-types')}
          >
            <BiSolidDonateHeart size={20} />
            Donation Types
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/donors') ? 'brand.100' : 'transparent'}
            color={isActive('/donors') ? 'brand.600' : 'inherit'}
            _hover={{ bg: 'brand.100', color: 'brand.600' }}
            onClick={() => navigate('/donors')}
          >
            <HiUserGroup size={24} />
            Donors
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={isActive('/donations') ? 'brand.100' : 'transparent'}
            color={isActive('/donations') ? 'brand.600' : 'inherit'}
            _hover={{ bg: 'brand.100', color: 'brand.600' }}
            onClick={() => navigate('/donations')}
          >
            <BiSolidDonateBlood size={24} />
            Donations
          </Flex>
          <Flex
            minW={44}
            justify="flex-start"
            borderWidth={1}
            borderRadius="md"
            p={2}
            shadow="sm"
            alignItems="center"
            gap={3}
            cursor="pointer"
            bg={'transparent'}
            color={'inherit'}
            _hover={{ bg: 'brand.100', color: 'brand.600' }}
            onClick={() => logout()}
          >
            <IoLogOut size={24} />
            Logout
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
