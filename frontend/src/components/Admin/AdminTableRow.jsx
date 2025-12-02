import React from 'react';
import { TableRow, TableCell, Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * Memoized table row component to prevent unnecessary re-renders
 */
const AdminTableRow = React.memo(
  ({ row, columns, onView, onEdit, onDelete }) => (
    <TableRow hover>
      {columns.map((col) => (
        <TableCell key={`${row.id || row._id}-${col.field}`}>{row[col.field]}</TableCell>
      ))}
      <TableCell align="center">
        <Stack direction="row" spacing={0.5} justifyContent="center">
          {onView && (
            <IconButton size="small" onClick={() => onView(row)} title="Voir">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          )}
          {onEdit && (
            <IconButton size="small" onClick={() => onEdit(row)} title="Modifier">
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={() => onDelete(row)}
              title="Supprimer"
              sx={{ color: '#d32f2f' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.row === nextProps.row &&
      prevProps.columns === nextProps.columns &&
      prevProps.onView === nextProps.onView &&
      prevProps.onEdit === nextProps.onEdit &&
      prevProps.onDelete === nextProps.onDelete
    );
  }
);

AdminTableRow.displayName = 'AdminTableRow';

export default AdminTableRow;
