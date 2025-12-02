import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  Typography,
} from '@mui/material';

// Import sub-components
import AdminTableSearch from './AdminTableSearch';
import AdminTableHeader from './AdminTableHeader';
import AdminTableRow from './AdminTableRow';
import AdminTablePagination from './AdminTablePagination';

/**
 * 🚀 Optimized Admin Table Component
 * Features: React.memo, useCallback, useMemo for performance optimization
 * Includes: Search, Sort, Pagination
 */
export default function AdminTable({
  columns = [],
  rows = [],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  loading = false,
  searchable = true,
  sortable = true,
  emptyMessage = 'Aucun élément',
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Memoized filter and sort logic
  const filteredRows = useMemo(() => {
    let filtered = [...rows];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((row) =>
        columns.some((col) => String(row[col.field]).toLowerCase().includes(searchLower))
      );
    }

    if (sortBy && sortable) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [rows, search, sortBy, sortOrder, columns, sortable]);

  const paginatedRows = useMemo(
    () => filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredRows, page, rowsPerPage]
  );

  const handleSort = useCallback(
    (field) => {
      setSortOrder(sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc');
      setSortBy(field);
    },
    [sortBy, sortOrder]
  );

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const memoizedOnEdit = useCallback(onEdit, [onEdit]);
  const memoizedOnDelete = useCallback(onDelete, [onDelete]);
  const memoizedOnView = useCallback(onView, [onView]);

  return (
    <Box>
      {searchable && (
        <AdminTableSearch value={search} onChange={handleSearch} placeholder="Rechercher..." />
      )}

      <TableContainer component={Paper}>
        <Table>
          <AdminTableHeader
            columns={columns}
            sortable={sortable}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => (
                <AdminTableRow
                  key={row.id || row._id}
                  row={row}
                  columns={columns}
                  onView={memoizedOnView}
                  onEdit={memoizedOnEdit}
                  onDelete={memoizedOnDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AdminTablePagination
        count={filteredRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
}
