import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './auth/AuthContext';
import { ErrorProvider, useError, setGlobalErrorHandler } from './shared/components/ErrorNotification';
import { router } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  palette: {
    background: {
      default: '#f0f4f8',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 12,
          borderRadius: '7px',
          fontFamily: 'inherit',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: 12,
            borderRadius: '7px',
          },
          '& .MuiInputLabel-root': {
            fontSize: 12,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: 12,
          borderRadius: '7px',
        },
      },
    },
  },
});

// Bridge component to wire up the global error handler
const ErrorBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showError } = useError();
  useEffect(() => {
    setGlobalErrorHandler(showError);
  }, [showError]);
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorProvider>
          <ErrorBridge>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ErrorBridge>
        </ErrorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
