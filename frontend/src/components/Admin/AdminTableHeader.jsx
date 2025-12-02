import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';

/**
 * Memoized table header component with optional sorting
 */
const AdminTableHeader = React.memo(
  ({ columns, sortable, sortBy, sortOrder, onSort }) => (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
        {columns.map((col) => (
          <TableCell
            key={col.field}
            onClick={() => sortable && onSort(col.field)}
            sx={{
              fontWeight: 600,
              cursor: sortable ? 'pointer' : 'default',
              userSelect: 'none',
            }}
          >
            {col.label}
            {sortable && sortBy === col.field && <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>}
          </TableCell>
        ))}
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.columns === nextProps.columns &&
      prevProps.sortBy === nextProps.sortBy &&
      prevProps.sortOrder === nextProps.sortOrder
    );
  }
);

AdminTableHeader.displayName = 'AdminTableHeader';

export default AdminTableHeader;
