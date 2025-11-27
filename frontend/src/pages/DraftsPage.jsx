/**
 * صفحة المسودات - Drafts Page
 * عرض واستعادة مسودات المناقصات المحفوظة
 * @component
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import institutionalTheme from '../theme/theme';
import {
  Container, Box, Card, CardContent, Grid, Button, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  Stack, Paper, IconButton, Tooltip, Avatar, LinearProgress, Divider
} from '@mui/material';
import {
  Edit, Delete, Restore, FileDownload, Clock, CheckCircle, Warning,
  ChevronRight, ArrowForward, Trash2
} from '@mui/icons-material';
import { setPageTitle } from '../utils/pageTitle';
import { logger } from '../utils/logger';
import { recoverDraft, clearDraft } from '../utils/draftStorageHelper';

const THEME = institutionalTheme;

function DraftsPageContent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  // جاهز جميع أنواع المسودات المتاحة
  const DRAFT_TYPES = [
    { key: 'tender_draft', name: 'مناقصة', icon: '📋', color: '#0056B3' },
    { key: 'offer_draft', name: 'عرض سعر', icon: '💼', color: '#2e7d32' },
    { key: 'invoice_draft', name: 'فاتورة', icon: '📄', color: '#f57c00' },
  ];

  useEffect(() => {
    setPageTitle('المسودات المحفوظة');
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    setLoading(true);
    try {
      const allDrafts = [];
      
      DRAFT_TYPES.forEach(({ key, name, icon, color }) => {
        const draft = localStorage.getItem(key);
        if (draft) {
          try {
            const parsedDraft = JSON.parse(draft);
            const savedTime = localStorage.getItem(`${key}_timestamp`) || new Date().toISOString();
            
            // حساب نسبة الإكمال
            const completeness = calculateCompleteness(parsedDraft);
            
            allDrafts.push({
              id: key,
              name: parsedDraft.title || parsedDraft.consultation_number || `${name} جديد`,
              type: name,
              icon,
              color,
              savedAt: new Date(savedTime),
              data: parsedDraft,
              completeness,
              size: (JSON.stringify(parsedDraft).length / 1024).toFixed(2),
            });
          } catch (e) {
            logger.error('Error parsing draft:', e);
          }
        }
      });

      setDrafts(allDrafts.sort((a, b) => b.savedAt - a.savedAt));
    } catch (error) {
      logger.error('Error loading drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompleteness = (draft) => {
    if (!draft) return 0;
    
    const requiredFields = ['title', 'description', 'deadline'];
    const filledFields = requiredFields.filter(f => draft[f] && String(draft[f]).trim());
    
    // فحص الحقول الاختيارية
    let optionalScore = 0;
    if (draft.lots?.length > 0) optionalScore += 20;
    if (draft.requirements?.length > 0) optionalScore += 20;
    if (draft.evaluation_criteria) optionalScore += 20;
    if (draft.specification_documents?.length > 0) optionalScore += 20;
    
    return Math.min(100, (filledFields.length / requiredFields.length) * 60 + optionalScore);
  };

  const handleResume = (draft) => {
    navigate('/create-tender', { state: { draft: draft.data } });
  };

  const handleDelete = (draft) => {
    setSelectedDraft(draft);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (selectedDraft) {
      clearDraft(selectedDraft.id);
      localStorage.removeItem(`${selectedDraft.id}_timestamp`);
      setDrafts(drafts.filter(d => d.id !== selectedDraft.id));
      setOpenDelete(false);
      setSelectedDraft(null);
    }
  };

  const getCompletenessColor = (completeness) => {
    if (completeness >= 80) return '#2e7d32';
    if (completeness >= 50) return '#f57c00';
    return '#c62828';
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ar-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        {/* الرأس */}
        <Paper elevation={0} sx={{
          background: 'linear-gradient(135deg, #0056B3 0%, #003d82 100%)',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          color: 'white',
        }}>
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              📝 المسودات المحفوظة
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              استئنف عمليات محفوظة أو استعد للنشر
            </Typography>
          </Stack>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <Typography>جاري التحميل...</Typography>
          </Box>
        ) : drafts.length === 0 ? (
          <Card sx={{ border: '1px solid #e0e0e0', borderRadius: '12px' }}>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Box sx={{ fontSize: 48, mb: 2 }}>📭</Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                لا توجد مسودات محفوظة
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                ابدأ بإنشاء مناقصة جديدة لحفظ مسودات
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/create-tender')}
                sx={{ backgroundColor: THEME.palette.primary.main }}
              >
                إنشاء مناقصة جديدة
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {/* عرض شامل */}
            <Grid item xs={12}>
              <Card sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>النوع</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>الاسم</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>تاريخ الحفظ</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>نسبة الإكمال</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>الحجم</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>الإجراءات</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {drafts.map((draft) => (
                        <TableRow key={draft.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                          <TableCell>
                            <Chip
                              label={`${draft.icon} ${draft.type}`}
                              size="small"
                              sx={{
                                backgroundColor: `${draft.color}15`,
                                color: draft.color,
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {draft.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Clock sx={{ fontSize: 16, color: '#999' }} />
                              <Typography variant="caption">
                                {formatDate(draft.savedAt)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <LinearProgress
                                variant="determinate"
                                value={draft.completeness}
                                sx={{
                                  height: 8,
                                  borderRadius: '4px',
                                  backgroundColor: '#e0e0e0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: getCompletenessColor(draft.completeness),
                                  }
                                }}
                              />
                              <Typography variant="caption" sx={{ fontSize: '11px' }}>
                                {Math.round(draft.completeness)}%
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${draft.size} KB`}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Stack direction="row" justifyContent="center" spacing={1}>
                              <Tooltip title="استئناف">
                                <IconButton
                                  size="small"
                                  onClick={() => handleResume(draft)}
                                  sx={{ color: THEME.palette.primary.main }}
                                >
                                  <Restore fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="حذف">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(draft)}
                                  sx={{ color: THEME.palette.error.main }}
                                >
                                  <Trash2 fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Card>
            </Grid>

            {/* عرض البطاقات */}
            {drafts.map((draft) => (
              <Grid item xs={12} sm={6} md={4} key={draft.id}>
                <Card sx={{
                  border: `2px solid ${draft.color}20`,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: draft.color,
                    boxShadow: `0 8px 24px ${draft.color}15`,
                    transform: 'translateY(-2px)',
                  }
                }}>
                  <CardContent>
                    <Stack spacing={2}>
                      {/* الرأس */}
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Box>
                          <Typography variant="h6" sx={{ fontSize: '20px', fontWeight: 700 }}>
                            {draft.icon}
                          </Typography>
                        </Box>
                        <Chip label={draft.type} size="small" sx={{ color: draft.color }} />
                      </Stack>

                      {/* الاسم */}
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                          الاسم
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                          {draft.name}
                        </Typography>
                      </Box>

                      {/* التاريخ */}
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px' }}>
                          تاريخ الحفظ
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          {formatDate(draft.savedAt)}
                        </Typography>
                      </Box>

                      {/* الإكمال */}
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="caption">نسبة الإكمال</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: getCompletenessColor(draft.completeness) }}>
                            {Math.round(draft.completeness)}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={draft.completeness}
                          sx={{
                            height: 6,
                            borderRadius: '3px',
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getCompletenessColor(draft.completeness),
                            }
                          }}
                        />
                      </Box>

                      {/* الأزرار */}
                      <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          startIcon={<Restore />}
                          onClick={() => handleResume(draft)}
                          sx={{
                            backgroundColor: draft.color,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          استئناف
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Trash2 />}
                          onClick={() => handleDelete(draft)}
                          sx={{
                            color: THEME.palette.error.main,
                            borderColor: THEME.palette.error.main,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: THEME.palette.error.light,
                              borderColor: THEME.palette.error.main,
                            }
                          }}
                        >
                          حذف
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* زر إنشاء جديد */}
        {drafts.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Edit />}
              onClick={() => navigate('/create-tender')}
              sx={{
                backgroundColor: THEME.palette.primary.main,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
              }}
            >
              إنشاء مناقصة جديدة
            </Button>
          </Box>
        )}
      </Container>

      {/* حوار حذف */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          ⚠️ حذف المسودة
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            هل أنت متأكد من حذف المسودة "<strong>{selectedDraft?.name}</strong>"؟ لا يمكن التراجع عن هذا الإجراء.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>إلغاء</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
          >
            حذف نهائياً
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function DraftsPage() {
  return <DraftsPageContent />;
}
