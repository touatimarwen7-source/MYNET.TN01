import { useState, useEffect, useCallback } from 'react';
import institutionalTheme from '../theme/theme';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { procurementAPI } from '../api';
import { formatDate } from '../utils/dateFormatter';
import { setPageTitle } from '../utils/pageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { TableSkeleton } from '../components/SkeletonLoader';
import { debounce, optimizedSearch } from '../utils/searchOptimization';

const ITEMS_PER_PAGE = 10;

export default function TenderList() {
  const theme = institutionalTheme;
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setPageTitle("Appels d'Offres");
  }, []);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const response = await procurementAPI.getTenders();
      setTenders(response.data.tenders || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = (tenderId) => {
    navigate(`/create-offer/${tenderId}`);
  };

  const performSearch = useCallback(
    debounce((term) => {
      setSearching(true);
      if (term.length >= 1) {
        const filtered = optimizedSearch(tenders, term, ['title', 'description']);
        setCurrentPage(1);
        setSearching(false);
      } else {
        setCurrentPage(1);
        setSearching(false);
      }
    }, 300),
    [tenders]
  );

  const handleFilterChange = (e) => {
    const term = e.target.value;
    setFilter(term);
    performSearch(term);
  };

  const filteredTenders = tenders.filter(
    (t) =>
      t.title?.toLowerCase().includes(filter.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(filter.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTenders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTenders = filteredTenders.slice(startIndex, endIndex);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return (
      <Box sx={{ backgroundColor: '#fafafa', paddingY: '40px' }}>
        <Container maxWidth="lg">
          <Typography
            sx={{ marginBottom: '24px', fontWeight: 600, color: theme.palette.primary.main }}
          >
            Appels d'Offres
          </Typography>
          <TableSkeleton rows={5} columns={5} />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', paddingY: '40px' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: '32px',
            fontWeight: 500,
            color: theme.palette.text.primary,
            marginBottom: '32px',
          }}
        >
          Appels d'Offres
        </Typography>

        <Card sx={{ marginBottom: '32px', border: '1px solid #e0e0e0' }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Filtrer par titre ou description..."
              value={filter}
              onChange={handleFilterChange}
              variant="outlined"
              inputProps={{ 'aria-label': "Filtrer les appels d'offres" }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                },
              }}
            />
          </CardContent>
        </Card>

        {filteredTenders.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#0d47a1',
              border: '1px solid #0056B3',
              borderRadius: '4px',
            }}
          >
            {filter
              ? "Aucun appel d'offres ne correspond à votre recherche"
              : "Aucun appel d'offres disponible"}
          </Alert>
        ) : (
          <>
            <Paper sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow sx={{ height: '56px' }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                      }}
                    >
                      Titre
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                      }}
                    >
                      Entreprise
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                      }}
                      align="right"
                    >
                      Catégorie
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                      }}
                    >
                      Date limite
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                      }}
                    >
                      Statut
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        textTransform: 'uppercase',
                        fontSize: '12px',
                      }}
                      align="center"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTenders.map((tender) => (
                    <TableRow
                      key={tender.id}
                      sx={{
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        cursor: 'pointer',
                        height: '56px',
                      }}
                    >
                      <TableCell
                        sx={{
                          color: theme.palette.text.primary,
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                      >
                        {tender.title}
                      </TableCell>
                      <TableCell sx={{ color: '#616161', fontSize: '14px' }}>
                        {tender.buyer_name || 'N/A'}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.primary,
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                        align="right"
                      >
                        {tender.category || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: '#616161', fontSize: '14px' }}>
                        {formatDate(tender.deadline)}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            backgroundColor:
                              tender.status === 'active'
                                ? '#e8f5e9'
                                : tender.status === 'closed'
                                  ? '#ffebee'
                                  : '#e3f2fd',
                            color:
                              tender.status === 'active'
                                ? '#1b5e20'
                                : tender.status === 'closed'
                                  ? '#c62828'
                                  : '#0d47a1',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          {tender.status === 'active'
                            ? 'Actif'
                            : tender.status === 'closed'
                              ? 'Clôturé'
                              : 'Brouillon'}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleParticipate(tender.id)}
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '12px',
                            minHeight: '36px',
                            '&:hover': { backgroundColor: '#0d47a1' },
                          }}
                        >
                          Participer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTenders.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Container>
    </Box>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { procurementAPI } from '../api/procurementApi';
import StatusBadge from '../components/StatusBadge';
import ErrorBoundary from '../components/ErrorBoundary';

const TenderList = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    'technology',
    'construction',
    'services',
    'supplies',
    'consulting',
    'equipment',
  ];

  const statuses = [
    { value: 'draft', label: 'مسودة' },
    { value: 'published', label: 'منشور' },
    { value: 'open', label: 'مفتوح' },
    { value: 'closed', label: 'مغلق' },
    { value: 'awarded', label: 'تم الترسية' },
  ];

  useEffect(() => {
    fetchTenders();
  }, [page, statusFilter, categoryFilter]);

  const fetchTenders = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters = {
        page,
        limit: 12,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
      };

      const response = await procurementAPI.getTenders(filters);
      
      if (response.data.success) {
        setTenders(response.data.tenders || []);
        setTotalPages(response.data.pagination?.pages || 1);
      } else {
        setError('فشل في تحميل المناقصات');
      }
    } catch (err) {
      console.error('Error fetching tenders:', err);
      setError(err.response?.data?.error || 'حدث خطأ أثناء تحميل المناقصات');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTender = (tenderId) => {
    navigate(`/tender/${tenderId}`);
  };

  const handleSearch = () => {
    setPage(1);
    fetchTenders();
  };

  const filteredTenders = searchTerm
    ? tenders.filter(
        (tender) =>
          tender.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tender.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tenders;

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-TN');
  };

  const formatCurrency = (amount, currency = 'TND') => {
    if (!amount) return 'غير محدد';
    return `${parseFloat(amount).toLocaleString('ar-TN')} ${currency}`;
  };

  if (loading && tenders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تحميل المناقصات...
        </Typography>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            المناقصات العامة
          </Typography>
          <Typography variant="body1" color="text.secondary">
            تصفح جميع المناقصات المتاحة وقدم عروضك
          </Typography>
        </Box>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="ابحث عن مناقصة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>الحالة</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="الحالة"
                >
                  <MenuItem value="">الكل</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>الفئة</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="الفئة"
                >
                  <MenuItem value="">الكل</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={handleSearch}
                sx={{ height: 56 }}
              >
                تطبيق
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tenders Grid */}
        {filteredTenders.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              لا توجد مناقصات متاحة حالياً
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredTenders.map((tender) => (
              <Grid item xs={12} md={6} lg={4} key={tender.id}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="h2" fontWeight="bold" sx={{ flex: 1 }}>
                        {tender.title}
                      </Typography>
                      <StatusBadge status={tender.status} />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {tender.description || 'لا يوجد وصف'}
                    </Typography>

                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={tender.category || 'غير محدد'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>الميزانية:</strong>{' '}
                        {formatCurrency(tender.budget_min)} - {formatCurrency(tender.budget_max)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>الموعد النهائي:</strong> {formatDate(tender.deadline)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>تاريخ الفتح:</strong> {formatDate(tender.opening_date)}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewTender(tender.id)}
                    >
                      عرض التفاصيل
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              السابق
            </Button>
            <Typography sx={{ lineHeight: '36px' }}>
              صفحة {page} من {totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              التالي
            </Button>
          </Box>
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default TenderList;
