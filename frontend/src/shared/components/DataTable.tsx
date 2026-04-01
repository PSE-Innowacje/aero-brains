import React, { useMemo } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
  type GridInitialState,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Box } from '@mui/material';

export interface DataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  loading?: boolean;
  onRowClick?: (id: number) => void;
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  initialFilter?: { field: string; operator: string; value: string };
}

function CustomToolbar() {
  return (
    <Box
      sx={{
        px: '13px',
        py: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
        bgcolor: '#f8fafc',
      }}
    >
      <GridToolbarFilterButton />
      <GridToolbarQuickFilter debounceMs={300} />
    </Box>
  );
}

function DataTable<T extends { id: number }>({
  rows,
  columns,
  loading = false,
  onRowClick,
  defaultSortField,
  defaultSortDirection = 'asc',
  initialFilter,
}: DataTableProps<T>) {
  const handleRowClick = (params: GridRowParams) => {
    if (onRowClick) {
      onRowClick(params.row.id as number);
    }
  };

  const enhancedColumns = useMemo(
    () => columns.map((col) => ({ filterable: true, ...col })),
    [columns],
  );

  const initialState = useMemo<GridInitialState>(() => {
    const state: GridInitialState = {
      pagination: { paginationModel: { pageSize: 10 } },
      filter: initialFilter
        ? {
            filterModel: {
              items: [
                {
                  field: initialFilter.field,
                  operator: initialFilter.operator,
                  value: initialFilter.value,
                },
              ],
            },
          }
        : { filterModel: { items: [] } },
    };
    if (defaultSortField) {
      state.sorting = {
        sortModel: [{ field: defaultSortField, sort: defaultSortDirection }],
      };
    }
    return state;
  }, [defaultSortField, defaultSortDirection, initialFilter]);

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        border: '0.5px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      <DataGrid
        rows={rows}
        columns={enhancedColumns}
        loading={loading}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={initialState}
        onRowClick={handleRowClick}
        disableRowSelectionOnClick
        disableColumnFilter={false}
        slots={{
          toolbar: CustomToolbar,
        }}
        rowHeight={42}
        columnHeaderHeight={34}
        sx={{
          border: 'none',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 12,

          // Header
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            minHeight: '34px !important',
            maxHeight: '34px !important',
          },
          '& .MuiDataGrid-columnHeader': {
            height: '34px !important',
            bgcolor: '#f8fafc',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#64748b',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },

          // Cells — vertically centered, white background
          '& .MuiDataGrid-cell': {
            fontSize: 12,
            color: '#1e293b',
            bgcolor: '#fff',
            borderBottom: '0.5px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            px: '13px',
            py: '6px',
            overflow: 'visible',
            whiteSpace: 'normal',
            lineHeight: 1.4,
          },
          '& .MuiDataGrid-cellContent': {
            overflow: 'visible',
          },

          // Rows
          '& .MuiDataGrid-row': {
            cursor: onRowClick ? 'pointer' : 'default',
            '&:hover': {
              bgcolor: '#f8fafc',
            },
            '&:last-child .MuiDataGrid-cell': {
              borderBottom: 'none',
            },
          },

          // Footer / pagination
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e2e8f0',
            bgcolor: '#f8fafc',
            minHeight: 38,
          },
          '& .MuiTablePagination-root': {
            fontSize: 11,
            color: '#64748b',
          },

          // Remove cell focus outline
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
            {
              outline: 'none',
            },
        }}
      />
    </Box>
  );
}

export default DataTable;
