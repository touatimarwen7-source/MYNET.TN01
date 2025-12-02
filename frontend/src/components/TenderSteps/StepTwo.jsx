import { Box, Typography, TextField } from '@mui/material';
import { THEME_STYLES } from './themeHelpers';

export default function StepTwo({ formData, handleChange, loading }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Publication Date */}
      <Box>
        <Typography sx={THEME_STYLES.label}>Date de Publication *</Typography>
        <TextField
          fullWidth
          type="datetime-local"
          name="publication_date"
          value={formData.publication_date}
          onChange={handleChange}
          disabled={loading}
          sx={THEME_STYLES.textFieldBase}
        />
      </Box>

      {/* Deadline */}
      <Box>
        <Typography sx={THEME_STYLES.label}>Date de Clôture *</Typography>
        <TextField
          fullWidth
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          disabled={loading}
          sx={THEME_STYLES.textFieldBase}
        />
      </Box>

      {/* Opening Date */}
      <Box>
        <Typography sx={THEME_STYLES.label}>Date d'Ouverture</Typography>
        <TextField
          fullWidth
          type="datetime-local"
          name="opening_date"
          value={formData.opening_date}
          onChange={handleChange}
          disabled={loading}
          sx={THEME_STYLES.textFieldBase}
        />
      </Box>
    </Box>
  );
}
