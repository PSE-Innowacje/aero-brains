import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ErrorEntry {
  id: number;
  status?: number;
  title: string;
  message: string;
  path?: string;
  timestamp: string;
}

interface ErrorContextType {
  showError: (error: { status?: number; title?: string; message: string; path?: string }) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

let errorIdCounter = 0;

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);

  const showError = useCallback((error: { status?: number; title?: string; message: string; path?: string }) => {
    const entry: ErrorEntry = {
      id: ++errorIdCounter,
      status: error.status,
      title: error.title || (error.status ? `Błąd ${error.status}` : 'Błąd'),
      message: error.message,
      path: error.path,
      timestamp: new Date().toLocaleTimeString('pl-PL'),
    };
    setErrors((prev) => [...prev, entry]);

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      setErrors((prev) => prev.filter((e) => e.id !== entry.id));
    }, 8000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {/* Error toast stack */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 420,
        }}
      >
        {errors.map((err) => (
          <Box
            key={err.id}
            sx={{
              bgcolor: '#fff',
              borderRadius: '10px',
              border: '0.5px solid #e2e8f0',
              borderLeft: '4px solid #dc2626',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              px: '16px',
              py: '12px',
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
              animation: 'slideIn 0.2s ease-out',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>
                  {err.title}
                </Typography>
                <Typography sx={{ fontSize: 10, color: '#94a3b8' }}>
                  {err.timestamp}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                {err.message}
              </Typography>
              {err.path && (
                <Typography sx={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', mt: 0.3 }}>
                  {err.path}
                </Typography>
              )}
            </Box>
            <IconButton size="small" onClick={() => dismiss(err.id)} sx={{ mt: -0.5, mr: -0.5 }}>
              <CloseIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
            </IconButton>
          </Box>
        ))}
      </Box>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Global error handler for axios — call this from outside React
let globalShowError: ErrorContextType['showError'] | null = null;

export const setGlobalErrorHandler = (handler: ErrorContextType['showError']) => {
  globalShowError = handler;
};

export const getGlobalErrorHandler = () => globalShowError;
