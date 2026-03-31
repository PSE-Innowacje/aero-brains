import React from 'react';
import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      bgcolor: '#fff',
      borderBottom: '1px solid #e2e8f0',
      px: '24px',
      py: '13px',
      mx: -3,
      mt: -3,
      mb: 2.5,
    }}
  >
    <Box>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
          color: '#0f172a',
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: 11,
            color: '#94a3b8',
            mt: '1px',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
    {action}
  </Box>
);

export default PageHeader;
