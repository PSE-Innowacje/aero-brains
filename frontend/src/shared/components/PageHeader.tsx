import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action, onBack }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      bgcolor: '#fff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      px: '24px',
      py: '13px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {onBack && (
        <Box
          onClick={onBack}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#64748b',
            '&:hover': { bgcolor: '#f1f5f9', color: '#0f172a' },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </Box>
      )}
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
    </Box>
    {action}
  </Box>
);

export default PageHeader;
