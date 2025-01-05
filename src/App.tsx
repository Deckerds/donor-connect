import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from './components/ui/toaster';
import { system } from './theme/theme';
import { router } from './routes/Routes';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <Toaster />
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
