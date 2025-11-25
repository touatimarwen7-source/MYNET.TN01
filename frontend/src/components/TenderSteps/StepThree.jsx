import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import institutionalTheme from '../../theme/theme';
import { UNIT_OPTIONS } from '../../utils/unitOptions';

export default function StepThree({ formData, setFormData, loading }) {
  const [newLot, setNewLot] = useState({ numero: '', objet: '', articles: [] });
  const [newArticle, setNewArticle] = useState({ name: '', quantity: '', unit: '' });
  const [editingLotIndex, setEditingLotIndex] = useState(null);
  const [editingArticleIndex, setEditingArticleIndex] = useState(null);
  const theme = institutionalTheme;

  const handleAddArticle = () => {
    if (!newArticle.name.trim() || !newArticle.quantity.trim() || !newArticle.unit || newArticle.unit === 'unité') {
      alert('✋ Veuillez remplir: Nom, Quantité et Unité de l\'article');
      return;
    }
    
    const updated = [...(newLot.articles || [])];
    if (editingArticleIndex !== null) {
      updated[editingArticleIndex] = newArticle;
      setEditingArticleIndex(null);
    } else {
      updated.push(newArticle);
    }
    setNewLot({ ...newLot, articles: updated });
    setNewArticle({ name: '', quantity: '', unit: '' });
  };

  const handleRemoveArticle = (index) => {
    setNewLot({
      ...newLot,
      articles: (newLot.articles || []).filter((_, i) => i !== index),
    });
  };

  const handleEditArticle = (index) => {
    setNewArticle((newLot.articles || [])[index]);
    setEditingArticleIndex(index);
  };

  const handleAddLot = () => {
    if (newLot.numero.trim() && newLot.objet.trim() && (newLot.articles || []).length > 0) {
      if (editingLotIndex !== null) {
        const updated = [...formData.lots];
        updated[editingLotIndex] = newLot;
        setFormData((prev) => ({ ...prev, lots: updated }));
        setEditingLotIndex(null);
      } else {
        setFormData((prev) => ({
          ...prev,
          lots: [...(prev.lots || []), newLot],
        }));
      }
      setNewLot({ numero: '', objet: '', articles: [] });
      setNewArticle({ name: '', quantity: '', unit: '' });
    }
  };

  const handleEditLot = (index) => {
    setNewLot(formData.lots[index]);
    setEditingLotIndex(index);
  };

  const handleRemoveLot = (index) => {
    setFormData((prev) => ({
      ...prev,
      lots: (prev.lots || []).filter((_, i) => i !== index),
    }));
  };

  const lots = formData.lots || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Award Level Selection */}
      <Box sx={{ p: '16px', backgroundColor: '#FFF3E0', borderRadius: '4px', borderLeft: '4px solid #FF9800' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#F57C00', mb: '12px' }}>
          🎯 Niveau de ترسية (Attribution)
        </Typography>
        <Typography sx={{ fontSize: '12px', color: '#666666', mb: '12px' }}>
          Sélectionnez à quel niveau l'attribution sera effectuée :
        </Typography>
        <Stack direction="row" spacing={2}>
          {[
            { value: 'lot', label: 'Par Lot', description: 'Un lot entier à un fournisseur' },
            { value: 'article', label: 'Par Article', description: 'Chaque article à un fournisseur' },
            { value: 'tender', label: 'Global', description: 'Toute l\'appel d\'offres' },
          ].map((option) => (
            <Box
              key={option.value}
              onClick={() => setFormData((prev) => ({ ...prev, awardLevel: option.value }))}
              sx={{
                flex: 1,
                p: '12px',
                border: formData.awardLevel === option.value ? '2px solid #0056B3' : '1px solid #ddd',
                backgroundColor: formData.awardLevel === option.value ? '#E3F2FD' : '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#0056B3' },
              }}
            >
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#212121' }}>
                {option.label}
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#666666' }}>
                {option.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Lot Input */}
      <Box sx={{ p: '16px', backgroundColor: '#E3F2FD', borderRadius: '4px', borderLeft: '4px solid #0056B3' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#0056B3', mb: '16px' }}>
          ➕ Créer un Nouveau Lot
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Numéro du Lot *"
            placeholder="Ex: 1, 2, 3..."
            value={newLot.numero}
            onChange={(e) => setNewLot({ ...newLot, numero: e.target.value })}
            disabled={loading}
            size="small"
            helperText="Exemple: Lot 1: Informatique"
          />

          <TextField
            fullWidth
            label="Objet du Lot (Description) *"
            placeholder="Ex: Informatique, Fournitures de Bureau, Services..."
            value={newLot.objet}
            onChange={(e) => setNewLot({ ...newLot, objet: e.target.value })}
            disabled={loading}
            size="small"
            multiline
            rows={2}
          />

          {/* Articles Section */}
          <Box sx={{ p: '14px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '2px dashed #0056B3' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '14px' }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#0056B3' }}>
                📦 Articles du Lot {newLot.numero || '?'}
              </Typography>
              <Box
                sx={{
                  fontSize: '10px',
                  color: '#fff',
                  backgroundColor: '#0056B3',
                  px: '6px',
                  py: '2px',
                  borderRadius: '12px',
                }}
              >
                {(newLot.articles || []).length}
              </Box>
            </Box>

            <Typography sx={{ fontSize: '11px', color: '#666666', mb: '12px', fontStyle: 'italic' }}>
              📌 Les articles ci-dessous appartiennent au Lot ci-dessus
            </Typography>

            {/* Article Input */}
            <Stack spacing={2} sx={{ mb: '12px' }}>
              <TextField
                fullWidth
                label="Nom de l'Article"
                placeholder="Ex: Imprimante Laser"
                value={newArticle.name}
                onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
                disabled={loading}
                size="small"
              />

              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  label="Quantité"
                  type="number"
                  value={newArticle.quantity}
                  onChange={(e) => setNewArticle({ ...newArticle, quantity: e.target.value })}
                  disabled={loading}
                  size="small"
                  inputProps={{ min: '1' }}
                />

                <Select
                  value={newArticle.unit}
                  onChange={(e) => setNewArticle({ ...newArticle, unit: e.target.value })}
                  disabled={loading}
                  size="small"
                  sx={{ minWidth: '120px' }}
                >
                  {UNIT_OPTIONS.map((group) => [
                    <MenuItem key={`header-${group.group}`} disabled sx={{ fontWeight: 600, color: '#0056B3', fontSize: '12px' }}>
                      ─ {group.group}
                    </MenuItem>,
                    ...group.options.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value} sx={{ pl: '24px', fontSize: '12px' }}>
                        {opt.label}
                      </MenuItem>
                    )),
                  ])}
                </Select>

                <Button
                  variant="contained"
                  onClick={handleAddArticle}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#0056B3',
                    color: '#fff',
                    textTransform: 'none',
                  }}
                >
                  {editingArticleIndex !== null ? '✓ MAJ' : '+ Ajouter'}
                </Button>

                {editingArticleIndex !== null && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setNewArticle({ name: '', quantity: '', unit: '' });
                      setEditingArticleIndex(null);
                    }}
                    disabled={loading}
                    sx={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                  >
                    Annuler
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Articles List */}
            {(newLot.articles || []).length > 0 && (
              <Stack spacing={1}>
                {newLot.articles.map((article, idx) => (
                  <Paper
                    key={idx}
                    sx={{
                      p: '8px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#F9F9F9',
                      borderLeft: '3px solid #4CAF50',
                    }}
                  >
                    <Typography sx={{ fontSize: '12px', color: '#212121' }}>
                      {article.name} - {article.quantity} {article.unit}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '4px' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditArticle(idx)}
                        disabled={loading}
                      >
                        <EditIcon sx={{ fontSize: '16px', color: '#0056B3' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveArticle(idx)}
                        disabled={loading}
                      >
                        <DeleteIcon sx={{ fontSize: '16px', color: '#d32f2f' }} />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={handleAddLot}
              disabled={loading || (newLot.articles || []).length === 0}
              sx={{
                backgroundColor: '#0056B3',
                color: '#fff',
                flex: 1,
                textTransform: 'none',
              }}
            >
              {editingLotIndex !== null ? '✓ Mettre à Jour' : '✓ Ajouter Lot'}
            </Button>
            {editingLotIndex !== null && (
              <Button
                variant="outlined"
                onClick={() => {
                  setNewLot({ numero: '', objet: '', articles: [] });
                  setEditingLotIndex(null);
                  setNewArticle({ name: '', quantity: '', unit: '' });
                  setEditingArticleIndex(null);
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

      {/* Lots List */}
      {lots.length > 0 && (
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '12px' }}>
            📋 Lots ({lots.length})
          </Typography>
          <Stack spacing={2}>
            {lots.map((lot, index) => (
              <Paper
                key={index}
                sx={{
                  p: '16px',
                  backgroundColor: '#F9F9F9',
                  borderLeft: '4px solid #0056B3',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: '12px' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121' }}>
                      Lot {lot.numero}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                      {lot.objet}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditLot(index)}
                      disabled={loading}
                    >
                      <EditIcon sx={{ fontSize: '18px', color: '#0056B3' }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveLot(index)}
                      disabled={loading}
                    >
                      <DeleteIcon sx={{ fontSize: '18px', color: '#d32f2f' }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Articles Display */}
                {(lot.articles || []).length > 0 && (
                  <Box sx={{ mt: '12px', ml: '16px', pl: '12px', borderLeft: '3px dashed #0056B3' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#0056B3', mb: '8px' }}>
                      📌 Articles :
                    </Typography>
                    <Stack spacing={1}>
                      {lot.articles.map((article, aIdx) => (
                        <Box
                          key={aIdx}
                          sx={{
                            p: '8px 10px',
                            backgroundColor: '#FAFAFA',
                            borderLeft: '3px solid #4CAF50',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Typography sx={{ fontSize: '11px', color: '#4CAF50', fontWeight: 600 }}>
                            ├─
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#212121' }}>
                              {article.name}
                            </Typography>
                            <Typography sx={{ fontSize: '10px', color: '#999999' }}>
                              Quantité: <strong>{article.quantity} {article.unit}</strong>
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
