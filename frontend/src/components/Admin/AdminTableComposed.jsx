/**
 * 📋 COMPOSED ADMIN TABLE COMPONENT
 * Unified admin table combining all sub-components
 * Consolidates: Header, Row, Search, Pagination
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Box, Paper, Table, TableBody, TableContainer, CircularProgress } from '@mui/material';
import AdminTableHeader from './AdminTableHeader';
import AdminTableRow from './AdminTableRow';
import AdminTableSearch from './AdminTableSearch';
import AdminTablePagination from './AdminTablePagination';
import SkeletonLoader from '../SkeletonLoader';
import { THEME_COLORS } from '../../theme/theme';

/**
 * Unified Admin Table Component
 * @param {Object} props - Component props
 * @param {Array} props.rows - Data rows
 * @param {Array} props.columns - Column definitions
 * @param {Boolean} props.loading - Loading state
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 */
const AdminTableComposed = ({
  rows = [],
  columns = [],
  loading = false,
  onEdit,
  onDelete,
  title = 'Data Table',
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [rows, searchTerm]);

  // Paginate rows
  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setPage(0);
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <AdminTableSearch value={searchTerm} onChange={handleSearch} />

      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 1 }}>
        <Table stickyHeader>
          <AdminTableHeader columns={columns} />
          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => (
                <AdminTableRow
                  key={row.id || idx}
                  row={row}
                  columns={columns}
                  onEdit={() => onEdit?.(row)}
                  onDelete={() => onDelete?.(row.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                  No data available
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AdminTablePagination
        count={filteredRows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AdminTableComposed;
