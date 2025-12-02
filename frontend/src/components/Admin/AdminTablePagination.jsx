import { TablePagination } from '@mui/material';

/**
 * Table pagination component
 */
export default function AdminTablePaginationComponent({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage="Lignes par page:"
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
    />
  );
}
