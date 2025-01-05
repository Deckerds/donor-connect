import { Center, Spinner } from '@chakra-ui/react';
import { FC, Fragment, ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuthenticated = () => {
    const hassAccessToken = localStorage.getItem('accessToken');

    setIsAuthenticated(!!hassAccessToken);
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

  return isAuthenticated ? (
    <Fragment>{element}</Fragment>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
