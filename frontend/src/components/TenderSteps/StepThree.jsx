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
import { UNIT_OPTIONS } from '../../utils/unitOptions';
import { THEME_COLORS, THEME_STYLES } from './themeHelpers';

export default function StepThree({ formData, setFormData, loading }) {
  const [newLot, setNewLot] = useState({ numero: '', objet: '', articles: [] });
  const [newArticle, setNewArticle] = useState({ name: '', quantity: '', unit: '' });
  const [editingLotIndex, setEditingLotIndex] = useState(null);
  const [editingArticleIndex, setEditingArticleIndex] = useState(null);

  const handleAddArticle = () => {
    if (
      !newArticle.name.trim() ||
      !newArticle.quantity.trim() ||
      !newArticle.unit ||
      newArticle.unit === 'unité'
    ) {
      alert("✋ Veuillez remplir: Nom, Quantité et Unité de l'article");
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
      <Box
        sx={{
          p: '16px',
          backgroundColor: `${THEME_COLORS.warningLight}15`,
          borderRadius: '4px',
          borderLeft: `4px solid ${THEME_COLORS.warningLight}`,
        }}
      >
        <Typography
          sx={{ fontSize: '13px', fontWeight: 600, color: THEME_COLORS.warning, mb: '12px' }}
        >
          🎯 Niveau de ترسية (Attribution)
        </Typography>
        <Typography sx={{ fontSize: '12px', color: THEME_COLORS.textSecondary, mb: '12px' }}>
          Sélectionnez à quel niveau l'attribution sera effectuée :
        </Typography>
        <Stack direction="row" spacing={2}>
          {[
            { value: 'lot', label: 'Par Lot', description: 'Un lot entier à un fournisseur' },
            {
              value: 'article',
              label: 'Par Article',
              description: 'Chaque article à un fournisseur',
            },
            { value: 'tender', label: 'Global', description: "Toute l'appel d'offres" },
          ].map((option) => (
            <Box
              key={option.value}
              onClick={() => setFormData((prev) => ({ ...prev, awardLevel: option.value }))}
              sx={{
                flex: 1,
                p: '12px',
                border:
                  formData.awardLevel === option.value
                    ? `2px solid ${THEME_COLORS.primary}`
                    : '1px solid #ddd',
                backgroundColor:
                  formData.awardLevel === option.value
                    ? `${THEME_COLORS.primary}10`
                    : THEME_COLORS.bgPaper,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: THEME_COLORS.primary },
              }}
            >
              <Typography
                sx={{ fontSize: '12px', fontWeight: 600, color: THEME_COLORS.textPrimary }}
              >
                {option.label}
              </Typography>
              <Typography sx={{ fontSize: '11px', color: THEME_COLORS.textSecondary }}>
                {option.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Lot Input */}
      <Box
        sx={{
          p: '16px',
          backgroundColor: `${THEME_COLORS.primary}10`,
          borderRadius: '4px',
          borderLeft: `4px solid ${THEME_COLORS.primary}`,
        }}
      >
        <Typography
          sx={{ fontSize: '13px', fontWeight: 600, color: THEME_COLORS.primary, mb: '16px' }}
        >
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
          <Box
            sx={{
              p: '14px',
              backgroundColor: THEME_COLORS.bgPaper,
              borderRadius: '4px',
              border: `2px dashed ${THEME_COLORS.primary}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '14px' }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: THEME_COLORS.primary }}>
                📦 Articles du Lot {newLot.numero || '?'}
              </Typography>
              <Box sx={THEME_STYLES.badge}>{(newLot.articles || []).length}</Box>
            </Box>

            <Typography
              sx={{
                fontSize: '11px',
                color: THEME_COLORS.textSecondary,
                mb: '12px',
                fontStyle: 'italic',
              }}
            >
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
                    <MenuItem
                      key={`header-${group.group}`}
                      disabled
                      sx={{ fontWeight: 600, color: THEME_COLORS.primary, fontSize: '12px' }}
                    >
                      ─ {group.group}
                    </MenuItem>,
                    ...group.options.map((opt) => (
                      <MenuItem
                        key={opt.value}
                        value={opt.value}
                        sx={{ pl: '24px', fontSize: '12px' }}
                      >
                        {opt.label}
                      </MenuItem>
                    )),
                  ])}
                </Select>

                <Button
                  variant="contained"
                  onClick={handleAddArticle}
                  disabled={loading}
                  sx={{ ...THEME_STYLES.buttonPrimary }}
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
                    sx={THEME_STYLES.buttonError}
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
                      backgroundColor: THEME_COLORS.bgDefault,
                      borderLeft: `3px solid ${THEME_COLORS.successLight}`,
                    }}
                  >
                    <Typography sx={{ fontSize: '12px', color: THEME_COLORS.textPrimary }}>
                      {article.name} - {article.quantity} {article.unit}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '4px' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditArticle(idx)}
                        disabled={loading}
                      >
                        <EditIcon sx={{ fontSize: '16px', color: THEME_COLORS.primary }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveArticle(idx)}
                        disabled={loading}
                      >
                        <DeleteIcon sx={{ fontSize: '16px', color: THEME_COLORS.errorLight }} />
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
              sx={{ ...THEME_STYLES.buttonPrimary, flex: 1 }}
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
                sx={THEME_STYLES.buttonError}
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
          <Typography
            sx={{ fontSize: '13px', fontWeight: 600, color: THEME_COLORS.textPrimary, mb: '12px' }}
          >
            📋 Lots ({lots.length})
          </Typography>
          <Stack spacing={2}>
            {lots.map((lot, index) => (
              <Paper
                key={index}
                sx={{
                  p: '16px',
                  backgroundColor: THEME_COLORS.bgDefault,
                  borderLeft: `4px solid ${THEME_COLORS.primary}`,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: '12px',
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{ fontSize: '13px', fontWeight: 600, color: THEME_COLORS.textPrimary }}
                    >
                      Lot {lot.numero}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>
                      {lot.objet}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditLot(index)}
                      disabled={loading}
                    >
                      <EditIcon sx={{ fontSize: '18px', color: THEME_COLORS.primary }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveLot(index)}
                      disabled={loading}
                    >
                      <DeleteIcon sx={{ fontSize: '18px', color: THEME_COLORS.errorLight }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Articles Display */}
                {(lot.articles || []).length > 0 && (
                  <Box
                    sx={{
                      mt: '12px',
                      ml: '16px',
                      pl: '12px',
                      borderLeft: `3px dashed ${THEME_COLORS.primary}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: THEME_COLORS.primary,
                        mb: '8px',
                      }}
                    >
                      📌 Articles :
                    </Typography>
                    <Stack spacing={1}>
                      {lot.articles.map((article, aIdx) => (
                        <Box
                          key={aIdx}
                          sx={{
                            p: '8px 10px',
                            backgroundColor: THEME_COLORS.bgDefault,
                            borderLeft: `3px solid ${THEME_COLORS.successLight}`,
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '11px',
                              color: THEME_COLORS.successLight,
                              fontWeight: 600,
                            }}
                          >
                            ├─
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontSize: '11px',
                                fontWeight: 500,
                                color: THEME_COLORS.textPrimary,
                              }}
                            >
                              {article.name}
                            </Typography>
                            <Typography sx={{ fontSize: '10px', color: THEME_COLORS.textDisabled }}>
                              Quantité:{' '}
                              <strong>
                                {article.quantity} {article.unit}
                              </strong>
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
