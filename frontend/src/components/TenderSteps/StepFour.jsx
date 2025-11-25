import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { REQUIREMENT_TYPES, REQUIREMENT_PRIORITIES } from './constants';

export default function StepFour({ formData, setFormData, loading }) {
  const [newReq, setNewReq] = useState('');
  const [reqType, setReqType] = useState('technical');
  const [reqPriority, setReqPriority] = useState('important');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddRequirement = () => {
    if (newReq.trim()) {
      if (editingIndex !== null) {
        const updated = [...formData.requirements];
        updated[editingIndex] = { text: newReq, type: reqType, priority: reqPriority };
        setFormData((prev) => ({ ...prev, requirements: updated }));
        setEditingIndex(null);
      } else {
        setFormData((prev) => ({
          ...prev,
          requirements: [
            ...(prev.requirements || []),
            { text: newReq, type: reqType, priority: reqPriority },
          ],
        }));
      }
      setNewReq('');
      setReqType('technical');
      setReqPriority('important');
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: (prev.requirements || []).filter((_, i) => i !== index),
    }));
  };

  const handleEditRequirement = (index) => {
    const req = formData.requirements[index];
    setNewReq(req.text);
    setReqType(req.type);
    setReqPriority(req.priority);
    setEditingIndex(index);
  };

  const requirements = formData.requirements || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Input Area */}
      <Box sx={{ p: '16px', backgroundColor: '#FFF3E0', borderRadius: '4px' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#F57C00', mb: '16px' }}>
          ➕ Ajouter une Exigence
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Description de l'exigence"
            value={newReq}
            onChange={(e) => setNewReq(e.target.value)}
            disabled={loading}
            size="small"
            multiline
            rows={2}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={reqType}
                onChange={(e) => setReqType(e.target.value)}
                disabled={loading}
                label="Type"
              >
                {REQUIREMENT_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>Priorité</InputLabel>
              <Select
                value={reqPriority}
                onChange={(e) => setReqPriority(e.target.value)}
                disabled={loading}
                label="Priorité"
              >
                {REQUIREMENT_PRIORITIES.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={handleAddRequirement}
              disabled={loading}
              sx={{
                backgroundColor: '#0056B3',
                color: '#fff',
                flex: 1,
                textTransform: 'none',
              }}
            >
              {editingIndex !== null ? 'Mettre à Jour' : 'Ajouter'}
            </Button>
            {editingIndex !== null && (
              <Button
                variant="outlined"
                onClick={() => {
                  setNewReq('');
                  setReqType('technical');
                  setReqPriority('important');
                  setEditingIndex(null);
                }}
                disabled={loading}
                sx={{ color: '#d32f2f', borderColor: '#d32f2f' }}
              >
                Annuler
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Requirements List */}
      {requirements.length > 0 && (
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '12px' }}>
            Exigences ({requirements.length})
          </Typography>
          <Stack spacing={1}>
            {requirements.map((req, index) => (
              <Paper
                key={index}
                sx={{
                  p: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  backgroundColor: '#F9F9F9',
                  borderLeft: `4px solid ${
                    REQUIREMENT_PRIORITIES.find((p) => p.value === req.priority)?.color || '#999'
                  }`,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '13px', color: '#212121', mb: '8px' }}>
                    {req.text}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Chip
                      label={REQUIREMENT_TYPES.find((t) => t.value === req.type)?.label}
                      size="small"
                      sx={{
                        height: '24px',
                        fontSize: '11px',
                        backgroundColor: '#E3F2FD',
                        color: '#0056B3',
                      }}
                    />
                    <Chip
                      label={REQUIREMENT_PRIORITIES.find((p) => p.value === req.priority)?.label}
                      size="small"
                      sx={{
                        height: '24px',
                        fontSize: '11px',
                        backgroundColor: '#F0F0F0',
                        color: '#212121',
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditRequirement(index)}
                    disabled={loading}
                  >
                    <EditIcon sx={{ fontSize: '18px', color: '#0056B3' }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveRequirement(index)}
                    disabled={loading}
                  >
                    <DeleteIcon sx={{ fontSize: '18px', color: '#d32f2f' }} />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
