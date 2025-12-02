import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Alert,
  Grid,
  RadioGroup,
  Radio,
} from '@mui/material';
import institutionalTheme from '../../../theme/theme';

/**
 * Étape 4 : Critères d'Éligibilité et de Sécurité
 * @param {object} props
 * @param {object} props.formData - Données actuelles du formulaire
 * @param {function} props.setFormData - Fonction pour mettre à jour les données du formulaire
 * @param {boolean} props.loading - État de chargement
 */
const StepFour = ({ formData, setFormData, loading }) => {

  const handleEligibilityChange = (event) => {
    const { name, checked } = event.target;
    const currentEligibility = formData.eligibilityCriteria || [];
    let updatedEligibility;

    if (checked) {
      updatedEligibility = [...currentEligibility, name];
    } else {
      updatedEligibility = currentEligibility.filter(item => item !== name);
    }

    setFormData(prev => ({ ...prev, eligibilityCriteria: updatedEligibility }));
  };

  const handleSwitchChange = (event) => {
    const { name, checked } = event.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Alert severity="info">
        Définissez les conditions que les fournisseurs doivent remplir pour participer, et comment l'appel d'offres sera attribué.
      </Alert>

      <Grid container spacing={3}>
        {/* شروط الأهلية */}
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend" sx={{ fontWeight: 'bold', color: institutionalTheme.palette.primary.main, mb: 1 }}>
              Critères d'éligibilité obligatoires
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={(formData.eligibilityCriteria || []).includes('minRegistrationPeriod')} onChange={handleEligibilityChange} name="minRegistrationPeriod" />}
                label="Inscrit sur la plateforme depuis au moins 6 mois"
                disabled={loading}
              />
              <FormControlLabel
                control={<Checkbox checked={(formData.eligibilityCriteria || []).includes('hasPositiveRating')} onChange={handleEligibilityChange} name="hasPositiveRating" />}
                label="A une évaluation positive (plus de 4 étoiles)"
                disabled={loading}
              />
              <FormControlLabel
                control={<Checkbox checked={(formData.eligibilityCriteria || []).includes('isVerified')} onChange={handleEligibilityChange} name="isVerified" />}
                label="Compte vérifié (Verified)"
                disabled={loading}
              />
            </FormGroup>
          </FormControl>
        </Grid>

        {/* الموقع الجغرافي */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Zone géographique autorisée</InputLabel>
            <Select name="allowedLocation" value={formData.allowedLocation || 'all'} onChange={handleInputChange} label="Zone géographique autorisée" disabled={loading}>
              <MenuItem value="all">Toutes les régions</MenuItem>
              <MenuItem value="national">National uniquement</MenuItem>
              <MenuItem value="regional">Régional</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* شروط الترسية */}
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 'bold', color: institutionalTheme.palette.primary.main, mb: 1 }}>
              Conditions d'attribution
            </FormLabel>
            <RadioGroup name="awardCondition" value={formData.awardCondition || 'lowestPrice'} onChange={handleInputChange}>
              <FormControlLabel value="lowestPrice" control={<Radio />} label="Attribution complète au meilleur prix global" disabled={loading} />
              <FormControlLabel value="partialByItem" control={<Radio />} label="Attribution partielle par article et conformité" disabled={loading} />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* إذن إعادة التفاوض */}
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 'bold', color: institutionalTheme.palette.primary.main, mb: 1 }}>
              Paramètres de négociation
            </FormLabel>
            <FormControlLabel
              control={<Switch checked={formData.allowRenegotiation || false} onChange={handleSwitchChange} name="allowRenegotiation" />}
              label="Autoriser la renégociation avec les fournisseurs qualifiés"
              disabled={loading}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepFour;