import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import institutionalTheme from '../../../theme/theme';

/**
 * Étape 2 : Calendrier et Dates
 * @param {object} props
 * @param {object} props.formData - Données actuelles du formulaire
 * @param {function} props.setFormData - Fonction pour mettre à jour les données du formulaire
 * @param {boolean} props.loading - État de chargement
 */
const StepTwo = ({ formData, setFormData, loading }) => {
  
  // دالة مساعدة لمعالجة تغييرات التاريخ والوقت
  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value ? value.toISOString() : null,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const submissionDeadline = formData.submissionDeadline ? new Date(formData.submissionDeadline) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Alert severity="info">
          Définissez les dates clés du cycle de vie de l'appel d'offres. Ces dates contrôleront automatiquement l'ouverture et la fermeture de la soumission des offres.
        </Alert>

        <Grid container spacing={3}>
          {/* تاريخ الإغلاق */}
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Date de Clôture (Submission Deadline) *"
              value={submissionDeadline}
              onChange={(newValue) => handleDateChange('submissionDeadline', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disabled={loading}
              disablePast
            />
          </Grid>

          {/* تاريخ الفتح (فك التشفير) */}
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Date d'Ouverture (Déchiffrement) *"
              value={formData.decryptionDate ? new Date(formData.decryptionDate) : null}
              onChange={(newValue) => handleDateChange('decryptionDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disabled={loading || !submissionDeadline}
              minDateTime={submissionDeadline} // ✅ Validation: Doit être après la date de clôture
              helperText={!submissionDeadline ? "Veuillez d'abord définir la date de clôture" : ""}
            />
          </Grid>

          {/* بداية فترة الاستفسارات */}
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Début de la période de questions"
              value={formData.inquiryStartDate ? new Date(formData.inquiryStartDate) : null}
              onChange={(newValue) => handleDateChange('inquiryStartDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disabled={loading}
              maxDateTime={submissionDeadline} // ✅ التحقق: يجب أن يكون قبل تاريخ الإغلاق
            />
          </Grid>

          {/* نهاية فترة الاستفسارات */}
          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Fin de la période de questions"
              value={formData.inquiryEndDate ? new Date(formData.inquiryEndDate) : null}
              onChange={(newValue) => handleDateChange('inquiryEndDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disabled={loading || !formData.inquiryStartDate}
              minDateTime={formData.inquiryStartDate ? new Date(formData.inquiryStartDate) : null}
              maxDateTime={submissionDeadline} // ✅ التحقق: يجب أن يكون قبل تاريخ الإغلاق
            />
          </Grid>

          {/* فترة صلاحية العرض */}
          <Grid item xs={12} md={6}>
            <TextField
              name="offerValidityPeriod"
              label="Période de validité de l'offre (en jours)"
              type="number"
              value={formData.offerValidityPeriod || ''}
              onChange={handleInputChange}
              fullWidth
              placeholder="Exemple : 90"
              disabled={loading}
              InputProps={{
                endAdornment: <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>jours</Typography>,
              }}
            />
          </Grid>

          {/* نظام الإنذار */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Système d'alerte</InputLabel>
              <Select name="alertSystem" value={formData.alertSystem || ''} onChange={handleInputChange} label="Système d'alerte" disabled={loading}>
                <MenuItem value="none">Aucune alerte</MenuItem>
                <MenuItem value="24h">Alerte 24h avant la clôture</MenuItem>
                <MenuItem value="48h">Alerte 48h avant la clôture</MenuItem>
                <MenuItem value="7d">Alerte 1 semaine avant la clôture</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default StepTwo;