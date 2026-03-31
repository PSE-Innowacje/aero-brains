import React from 'react';
import { Box, Typography } from '@mui/material';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, headerAction }) => (
  <Box
    sx={{
      bgcolor: '#fff',
      borderRadius: '12px',
      border: '0.5px solid #e2e8f0',
      overflow: 'hidden',
      mb: 2.5,
    }}
  >
    {title && (
      <Box
        sx={{
          px: '18px',
          py: '14px',
          borderBottom: '0.5px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}
        >
          {title}
        </Typography>
        {headerAction}
      </Box>
    )}
    <Box sx={{ px: '18px', py: '16px' }}>{children}</Box>
  </Box>
);

export default Card;
