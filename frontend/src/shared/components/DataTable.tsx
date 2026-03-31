import React, { useMemo } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridSortModel,
  type GridFilterModel,
  type GridRowParams,
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
    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
  const sortModel: GridSortModel = useMemo(() => {
    if (!defaultSortField) return [];
    return [{ field: defaultSortField, sort: defaultSortDirection }];
  }, [defaultSortField, defaultSortDirection]);

  const filterModel: GridFilterModel | undefined = useMemo(() => {
    if (!initialFilter) return undefined;
    return {
      items: [
        {
          field: initialFilter.field,
          operator: initialFilter.operator,
          value: initialFilter.value,
        },
      ],
    };
  }, [initialFilter]);

  const handleRowClick = (params: GridRowParams) => {
    if (onRowClick) {
      onRowClick(params.row.id as number);
    }
  };

  // Ensure every column is filterable
  const enhancedColumns = useMemo(
    () => columns.map((col) => ({ filterable: true, ...col })),
    [columns],
  );

  return (
    <DataGrid
      rows={rows}
      columns={enhancedColumns}
      loading={loading}
      autoHeight
      pageSizeOptions={[10, 25, 50]}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      sortModel={sortModel}
      filterModel={filterModel}
      onRowClick={handleRowClick}
      disableRowSelectionOnClick
      disableColumnFilter={false}
      slots={{
        toolbar: CustomToolbar,
      }}
      slotProps={{
        filterPanel: {
          filterFormProps: {
            filterColumns: undefined,
          },
        },
      }}
      sx={{
        '& .MuiDataGrid-row': {
          cursor: onRowClick ? 'pointer' : 'default',
        },
      }}
    />
  );
}

export default DataTable;
