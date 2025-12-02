import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  Alert,
  Chip,
  Autocomplete,
  LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import institutionalTheme from '../../../theme/theme';

const PREDEFINED_CRITERIA = [
  { name: 'Conformité technique', weight: 40 },
  { name: 'Prix', weight: 30 },
  { name: 'Délai de livraison', weight: 15 },
  { name: 'Garantie et support', weight: 15 },
];

const PREDEFINED_DOCUMENTS = [
  'Registre de Commerce',
  'Relevé d\'Identité Bancaire (RIB)',
  'Attestation de Situation Fiscale',
  'Certificat ISO 9001',
  'Lettre de Garantie Bancaire',
];

/**
 * Étape 5 : Exigences d'Évaluation et Documents
 * @param {object} props
 * @param {object} props.formData - Données actuelles du formulaire
 * @param {function} props.setFormData - Fonction pour mettre à jour les données du formulaire
 * @param {boolean} props.loading - État de chargement
 */
const StepFive = ({ formData, setFormData, loading }) => {
  const evaluationCriteria = formData.evaluationCriteria || [];
  const requiredDocuments = formData.requiredDocuments || [];

  const [newCriterionName, setNewCriterionName] = useState('');

  const totalWeight = evaluationCriteria.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);

  useEffect(() => {
    if (!formData.evaluationCriteria) {
      setFormData(prev => ({ ...prev, evaluationCriteria: PREDEFINED_CRITERIA }));
    }
  }, []);

  const handleCriterionChange = (index, field, value) => {
    const updatedCriteria = [...evaluationCriteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    setFormData(prev => ({ ...prev, evaluationCriteria: updatedCriteria }));
  };

  const addCriterion = () => {
    if (newCriterionName.trim()) {
      const newCriterion = { name: newCriterionName, weight: 0 };
      setFormData(prev => ({ ...prev, evaluationCriteria: [...(prev.evaluationCriteria || []), newCriterion] }));
      setNewCriterionName('');
    }
  };

  const deleteCriterion = (index) => {
    const updatedCriteria = evaluationCriteria.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, evaluationCriteria: updatedCriteria }));
  };

  const handleDocumentsChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, requiredDocuments: newValue }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* قسم معايير التقييم */}
      <Paper sx={{ p: 3, borderLeft: `4px solid ${institutionalTheme.palette.primary.main}` }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: institutionalTheme.palette.primary.main }}>
          Système de Pondération de l'Évaluation
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Définissez les poids relatifs pour chaque critère d'évaluation. Le total doit être de 100%.
        </Alert>

        {evaluationCriteria.map((criterion, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
            <Grid item xs={7}>
              <TextField value={criterion.name} onChange={(e) => handleCriterionChange(index, 'name', e.target.value)} variant="outlined" size="small" fullWidth label="Critère d'évaluation" disabled={loading} />
            </Grid>
            <Grid item xs={3}>
              <TextField value={criterion.weight} onChange={(e) => handleCriterionChange(index, 'weight', e.target.value)} variant="outlined" size="small" type="number" label="Poids (%)" InputProps={{ inputProps: { min: 0, max: 100 } }} disabled={loading} />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => deleteCriterion(index)} color="error" disabled={loading}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Grid container spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
          <Grid item xs={7}>
            <TextField value={newCriterionName} onChange={(e) => setNewCriterionName(e.target.value)} variant="outlined" size="small" fullWidth label="Ajouter un nouveau critère" disabled={loading} />
          </Grid>
          <Grid item xs={5}>
            <Button startIcon={<AddIcon />} onClick={addCriterion} variant="outlined" disabled={loading || !newCriterionName.trim()}>
              Ajouter
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Total : {totalWeight}%
          </Typography>
          <LinearProgress variant="determinate" value={totalWeight > 100 ? 100 : totalWeight} color={totalWeight === 100 ? 'success' : 'warning'} sx={{ height: 10, borderRadius: 5 }} />
          {totalWeight !== 100 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Avertissement : Le total des poids doit être de 100%. Le total actuel est de {totalWeight}%.
            </Alert>
          )}
        </Box>
      </Paper>

      {/* قسم الوثائق المطلوبة */}
      <Paper sx={{ p: 3, borderLeft: `4px solid ${institutionalTheme.palette.secondary.main}` }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: institutionalTheme.palette.secondary.main }}>
          Documents Requis des Fournisseurs
        </Typography>
        <Autocomplete
          multiple
          freeSolo
          options={PREDEFINED_DOCUMENTS}
          value={requiredDocuments}
          onChange={handleDocumentsChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Documents obligatoires" placeholder="Sélectionnez ou ajoutez un nouveau document" />
          )}
          disabled={loading}
        />
        <Alert severity="info" sx={{ mt: 2 }}>
          Spécifiez les documents obligatoires que les fournisseurs doivent joindre à leurs offres.
        </Alert>
      </Paper>
    </Box>
  );
};

export default StepFive;