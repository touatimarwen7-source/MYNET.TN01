/**
 * 📱 Responsive Table Component - Mobile-First Design
 *
 * Features:
 * - Desktop: Full table view
 * - Tablet: Compact table with horizontal scroll
 * - Mobile: Card-based stack view with collapsible rows
 * - 100% MUI-based, zero custom CSS
 * - Theme-compliant colors and spacing
 */

import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Box,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { CONSISTENT_SX } from '../utils/consistencyHelper';

/**
 * Responsive Table - Adapts to screen size
 *
 * Props:
 * - columns: Array of { id, label (French), width? }
 * - rows: Array of row objects
 * - getRowId: (row) => unique id (recommended for key prop)
 * - renderCell: (value, column, row) => JSX (optional)
 * - onRowClick: (row) => void (optional)
 * - actions: Array of { render: (row, rowIndex) => JSX } (optional)
 * - title: string (optional)
 * - emptyMessage: string (default: 'Aucune donnée')
 */
export const ResponsiveTable = ({
  columns = [],
  rows = [],
  getRowId,
  renderCell,
  onRowClick,
  actions,
  title = 'Données',
  emptyMessage = 'Aucune donnée',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [expandedRows, setExpandedRows] = useState({});

  // Validate props
  if (!Array.isArray(columns) || columns.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Aucune colonne définie</Typography>
      </Box>
    );
  }

  if (!Array.isArray(rows)) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Données invalides</Typography>
      </Box>
    );
  }

  const toggleRowExpansion = useCallback((rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  }, []);

  // Memoize empty state
  const emptyState = useMemo(
    () => (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">{emptyMessage}</Typography>
      </Box>
    ),
    [emptyMessage]
  );

  if (rows.length === 0) {
    return emptyState;
  }

  // Mobile: Card-based stack view
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
        {rows.map((row, rowIndex) => {
          const rowId = getRowId ? getRowId(row) : rowIndex;
          const isExpanded = expandedRows[rowId];

          return (
            <Card key={rowId} sx={CONSISTENT_SX.card(theme)}>
              <CardContent sx={{ p: theme.spacing(2) }}>
                {/* Header row with expand button */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    mb: theme.spacing(1),
                  }}
                  onClick={() => toggleRowExpansion(rowId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleRowExpansion(rowId);
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {row[columns[0]?.id] || `${title} ${rowIndex + 1}`}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRowExpansion(rowId);
                    }}
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                {/* Collapsible content */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: theme.spacing(2) }}>
                    {columns.map((column) => (
                      <Box
                        key={column.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          py: theme.spacing(1),
                          borderTop: `1px solid ${theme.palette.divider}`,
                          '&:first-of-type': { borderTop: 'none' },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: theme.palette.text.secondary, pr: 1 }}
                        >
                          {column.label}:
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: 'right', flex: 1 }}>
                          {renderCell
                            ? renderCell(row[column.id], column, row)
                            : row[column.id] !== null && row[column.id] !== undefined
                              ? row[column.id]
                              : '-'}
                        </Typography>
                      </Box>
                    ))}

                    {/* Actions */}
                    {actions && actions.length > 0 && (
                      <Box
                        sx={{
                          mt: theme.spacing(2),
                          display: 'flex',
                          gap: theme.spacing(1),
                          flexWrap: 'wrap',
                        }}
                      >
                        {actions.map((action, idx) => (
                          <Box key={idx} sx={{ flex: '1 1 auto', minWidth: '100px' }}>
                            {action?.render ? action.render(row, rowIndex) : null}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  }

  // Tablet: Compact table with horizontal scroll
  if (isTablet) {
    return (
      <TableContainer
        component={Paper}
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Table size="small" sx={CONSISTENT_SX.table(theme)}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    p: theme.spacing(1),
                    color: theme.palette.text.primary,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    fontSize: '12px',
                    p: theme.spacing(1),
                  }}
                >
                  Acte
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => {
              const rowId = getRowId ? getRowId(row) : rowIndex;

              return (
                <TableRow
                  key={rowId}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': onRowClick ? { backgroundColor: theme.palette.action.hover } : {},
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        p: theme.spacing(1),
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: column.width || '150px',
                      }}
                    >
                      {renderCell
                        ? renderCell(row[column.id], column, row)
                        : row[column.id] !== null && row[column.id] !== undefined
                          ? row[column.id]
                          : '-'}
                    </TableCell>
                  ))}
                  {actions && actions.length > 0 && (
                    <TableCell align="center" sx={{ p: theme.spacing(1) }}>
                      <Box
                        sx={{ display: 'flex', gap: theme.spacing(0.5), justifyContent: 'center' }}
                      >
                        {actions.map((action, idx) => (
                          <Box key={idx} sx={{ display: 'inline-flex' }}>
                            {action?.render ? action.render(row, rowIndex) : null}
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Desktop: Full table view
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Table sx={CONSISTENT_SX.table(theme)}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                  p: theme.spacing(2),
                  color: theme.palette.text.primary,
                }}
              >
                {column.label}
              </TableCell>
            ))}
            {actions && actions.length > 0 && (
              <TableCell
                align="center"
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                  p: theme.spacing(2),
                  color: theme.palette.text.primary,
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => {
            const rowId = getRowId ? getRowId(row) : rowIndex;

            return (
              <TableRow
                key={rowId}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': onRowClick ? { backgroundColor: theme.palette.action.hover } : {},
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      p: theme.spacing(2),
                      width: column.width,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {renderCell
                      ? renderCell(row[column.id], column, row)
                      : row[column.id] !== null && row[column.id] !== undefined
                        ? row[column.id]
                        : '-'}
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell align="center" sx={{ p: theme.spacing(2) }}>
                    <Box sx={{ display: 'flex', gap: theme.spacing(1), justifyContent: 'center' }}>
                      {actions.map((action, idx) => (
                        <Box key={idx} sx={{ display: 'inline-flex' }}>
                          {action?.render ? action.render(row, rowIndex) : null}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// PropTypes for type safety
ResponsiveTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      width: PropTypes.string,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  getRowId: PropTypes.func,
  renderCell: PropTypes.func,
  onRowClick: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      render: PropTypes.func.isRequired,
    })
  ),
  title: PropTypes.string,
  emptyMessage: PropTypes.string,
};

ResponsiveTable.defaultProps = {
  rows: [],
  getRowId: null,
  renderCell: null,
  onRowClick: null,
  actions: null,
  title: 'Données',
  emptyMessage: 'Aucune donnée',
};

export default ResponsiveTable;
