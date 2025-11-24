import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import institutionalTheme from '../theme/theme';

export default function AddendumViewer({ tenderId }) {
  const [addenda, setAddenda] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddendum, setSelectedAddendum] = useState(null);
  const [newAddendum, setNewAddendum] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAddenda();
  }, [tenderId]);

  const fetchAddenda = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tenders/${tenderId}/addenda`);
      setAddenda(response.data.addenda || []);
    } catch (err) {
      setError('فشل في تحميل الملاحق');
    } finally {
      setLoading(false);
    }
  };

  const publishAddendum = async () => {
    if (!newAddendum.title || !newAddendum.content) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    try {
      await axios.post(`/api/tenders/${tenderId}/addenda`, newAddendum);
      setNewAddendum({ title: '', content: '' });
      fetchAddenda();
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      setError('فشل في نشر الملحق');
    }
  };

  const downloadAddendum = (addendum) => {
    const element = document.createElement('a');
    const file = new Blob([addendum.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${addendum.addendum_number}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: institutionalTheme.palette.primary.main, fontWeight: 'bold' }}>
          📄 الملاحق (Addenda) والتوضيحات
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ backgroundColor: institutionalTheme.palette.primary.main }}
        >
          نشر ملحق جديد
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {addenda.map((addendum) => (
            <Paper key={addendum.id} sx={{ mb: 2, p: 2 }}>
              <ListItem>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {addendum.title}
                    </Typography>
                    <Chip label={`النسخة ${addendum.version}`} size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', my: 1 }}>
                    {addendum.addendum_number}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {addendum.content.substring(0, 150)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedAddendum(addendum);
                        setOpenDialog(true);
                      }}
                      sx={{ color: institutionalTheme.palette.primary.main }}
                    >
                      عرض التفاصيل
                    </Button>
                    <Button
                      size="small"
                      onClick={() => downloadAddendum(addendum)}
                      sx={{ color: institutionalTheme.palette.primary.main }}
                    >
                      تحميل
                    </Button>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
                    تم النشر: {new Date(addendum.published_at).toLocaleDateString('ar-TN')}
                  </Typography>
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      {/* Create/View Addendum Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAddendum ? 'عرض الملحق' : 'نشر ملحق جديد'}
        </DialogTitle>
        <DialogContent>
          {selectedAddendum ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {selectedAddendum.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                {selectedAddendum.addendum_number} - النسخة {selectedAddendum.version}
              </Typography>
              <Typography variant="body2">
                {selectedAddendum.content}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="عنوان الملحق"
                value={newAddendum.title}
                onChange={(e) => setNewAddendum({ ...newAddendum, title: e.target.value })}
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="محتوى الملحق"
                value={newAddendum.content}
                onChange={(e) => setNewAddendum({ ...newAddendum, content: e.target.value })}
                margin="normal"
                variant="outlined"
                multiline
                rows={6}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setSelectedAddendum(null);
          }}>
            إغلاق
          </Button>
          {!selectedAddendum && (
            <Button onClick={publishAddendum} variant="contained" sx={{ backgroundColor: institutionalTheme.palette.primary.main }}>
              نشر الملحق
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
