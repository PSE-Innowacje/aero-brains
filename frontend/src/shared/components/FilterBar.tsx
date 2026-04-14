import React from 'react';
import { Box, Typography } from '@mui/material';

export interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterBarProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  counts?: Record<string, number>;
}

const FilterBar: React.FC<FilterBarProps> = ({ label, options, value, onChange, counts }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      mb: 1.5,
      flexWrap: 'wrap',
    }}
  >
    <Typography sx={{ fontSize: 11, color: '#64748b', fontWeight: 600, mr: 0.5 }}>
      {label}:
    </Typography>
    {options.map((opt) => {
      const isActive = value === opt.value;
      const count = counts?.[opt.value];
      return (
        <Box
          key={opt.value}
          onClick={() => onChange(opt.value)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            px: '10px',
            py: '3px',
            borderRadius: '20px',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            border: isActive ? '1.5px solid' : '1px solid #e2e8f0',
            borderColor: isActive ? (opt.color || '#3b7ff5') : '#e2e8f0',
            bgcolor: isActive ? (opt.color ? `${opt.color}18` : '#dbeafe') : '#fff',
            color: isActive ? (opt.color || '#1d4ed8') : '#475569',
            '&:hover': {
              borderColor: opt.color || '#3b7ff5',
              bgcolor: opt.color ? `${opt.color}10` : '#f0f7ff',
            },
          }}
        >
          {opt.label}
          {count !== undefined && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                opacity: 0.7,
                marginLeft: 2,
                minWidth: 14,
                textAlign: 'center',
              }}
            >
              {count}
            </span>
          )}
        </Box>
      );
    })}
  </Box>
);

export default FilterBar;
