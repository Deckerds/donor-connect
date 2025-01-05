import { Center, Spinner } from '@chakra-ui/react';
import { FC, Fragment, ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  element: ReactNode;
}

const AdminRoute: FC<AdminRouteProps> = ({ element }) => {
  const { getRole } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const role = getRole();

  const checkAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isAuthenticated && role.code !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return isAuthenticated ? (
    <Fragment>{element}</Fragment>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
