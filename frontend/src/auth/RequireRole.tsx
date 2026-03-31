import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import type { UserRole } from '../api/types';
import { useAuth } from './AuthContext';

interface RequireRoleProps {
  roles: UserRole[];
  children: ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ roles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Brak dostępu
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Nie masz uprawnień do wyświetlenia tej strony.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default RequireRole;
