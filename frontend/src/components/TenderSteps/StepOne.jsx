import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import institutionalTheme from '../../theme/theme';

const CATEGORIES = [
  { value: 'technology', label: 'Technologie & IT' },
  { value: 'supplies', label: 'Fournitures & Consommables' },
  { value: 'services', label: 'Services' },
  { value: 'construction', label: 'Construction & Travaux' },
  { value: 'other', label: 'Autres' },
];

export default function StepOne({ formData, handleChange, loading }) {
  const theme = institutionalTheme;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Consultation Number */}
      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '8px' }}>
          N° Consultation *
        </Typography>
        <TextField
          fullWidth
          placeholder="Ex: CONS-2024-001"
          name="consultation_number"
          value={formData.consultation_number}
          onChange={handleChange}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
              backgroundColor: '#FAFAFA',
            },
          }}
        />
      </Box>

      {/* Title */}
      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '8px' }}>
          Titre de l'Appel d'Offres *
        </Typography>
        <TextField
          fullWidth
          placeholder="Ex: Fourniture d'équipements informatiques"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={loading}
          inputProps={{ maxLength: 100 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
              backgroundColor: '#FAFAFA',
            },
          }}
        />
        <Typography sx={{ fontSize: '12px', color: '#999999', mt: '6px' }}>
          {(formData.title || '').length}/100 caractères
        </Typography>
      </Box>

      {/* Description */}
      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '8px' }}>
          Description Détaillée *
        </Typography>
        <TextField
          fullWidth
          placeholder="Décrivez l'objet de votre appel d'offres en détail..."
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          multiline
          rows={5}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
              backgroundColor: '#FAFAFA',
            },
          }}
        />
        <Typography sx={{ fontSize: '12px', color: '#999999', mt: '6px' }}>
          Minimum 20 caractères | Actuel: {(formData.description || '').length}
        </Typography>
      </Box>

      {/* Category */}
      <FormControl>
        <InputLabel sx={{ fontSize: '13px' }}>Catégorie *</InputLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={loading}
          label="Catégorie *"
          sx={{ borderRadius: '4px' }}
        >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Visibility */}
      <FormControlLabel
        control={
          <Checkbox
            name="is_public"
            checked={formData.is_public}
            onChange={handleChange}
            disabled={loading}
            sx={{ color: institutionalTheme.palette.primary.main }}
          />
        }
        label="🌐 Appel d'offres public (visible à tous les fournisseurs)"
      />
    </Box>
  );
}
