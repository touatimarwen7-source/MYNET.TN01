/**
 * 🚀 Optimized TenderList Component
 * Performance: Pagination, caching, lazy loading
 * Features: Selective columns, parallel requests, 5-min cache
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Container,
} from '@mui/material';
import { useOptimizedFetch } from '../hooks/useOptimizedFetch';
import TenderCard from '../components/TenderCard';
import { setPageTitle } from '../utils/pageTitle';

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 20;

export default function TenderListOptimized() {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { data, loading, error, pagination, fetchData, goToPage } = useOptimizedFetch(
    '/api/procurement/tenders'
  );

  useEffect(() => {
    setPageTitle('قائمة المناقصات');
  }, []);

  useEffect(() => {
    fetchData('/api/procurement/tenders', {
      page: pagination.page,
      limit: pageSize,
    });
  }, [pagination.page, pageSize, fetchData]);

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    goToPage(1);
  };

  const tenders = data?.tenders || [];
  const maxPages = Math.ceil(pagination.total / pageSize);

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3, direction: 'rtl' }}>
        {/* Page Size Control */}
        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel>عدد العناصر في الصفحة</InputLabel>
          <Select value={pageSize} onChange={handlePageSizeChange} label="عدد العناصر في الصفحة">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Tenders Grid */}
        {!loading && tenders.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 2,
              mb: 3,
            }}
          >
            {tenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!loading && tenders.length === 0 && <Alert severity="info">لا توجد مناقصات متاحة</Alert>}

        {/* Pagination Controls */}
        {!loading && maxPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={maxPages}
              page={pagination.page}
              onChange={(e, page) => goToPage(page)}
              color="primary"
              siblingCount={2}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
