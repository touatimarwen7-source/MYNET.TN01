import { Box, Typography, TextField, Stack, Alert } from '@mui/material';
import { THEME_COLORS, THEME_STYLES } from './themeHelpers';

export default function StepFive({ formData, handleChange, totalCriteria, loading }) {
  const criteria = [
    { key: 'price', label: 'Prix' },
    { key: 'quality', label: 'Qualité' },
    { key: 'delivery', label: 'Délai de Livraison' },
    { key: 'experience', label: 'Expérience' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Alert severity="info" sx={THEME_STYLES.alertInfo}>
        ℹ️ Distribuer 100 points entre les critères. Total actuel: <strong>{totalCriteria}%</strong>
      </Alert>

      <Stack spacing={2}>
        {criteria.map((c) => (
          <Box key={c.key}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '8px' }}>
              <Typography
                sx={{ fontSize: '13px', fontWeight: 600, color: THEME_COLORS.textPrimary }}
              >
                {c.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color:
                    formData.evaluation_criteria[c.key] > 0
                      ? THEME_COLORS.primary
                      : THEME_COLORS.textDisabled,
                }}
              >
                {formData.evaluation_criteria[c.key]}%
              </Typography>
            </Box>
            <TextField
              fullWidth
              type="number"
              name={`evaluation_criteria.${c.key}`}
              value={formData.evaluation_criteria[c.key]}
              onChange={(e) => {
                const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                handleChange({
                  target: {
                    name: `evaluation_criteria.${c.key}`,
                    value: val,
                  },
                });
              }}
              disabled={loading}
              inputProps={{ min: 0, max: 100 }}
              size="small"
              sx={THEME_STYLES.textFieldBase}
            />
          </Box>
        ))}
      </Stack>

      {totalCriteria === 100 && (
        <Alert severity="success" sx={THEME_STYLES.alertSuccess}>
          ✅ Critères correctement distribués
        </Alert>
      )}

      {totalCriteria !== 100 && totalCriteria > 0 && (
        <Alert severity="warning" sx={THEME_STYLES.alertWarning}>
          ⚠️ Le total doit être exactement 100% (actuel: {totalCriteria}%)
        </Alert>
      )}
    </Box>
  );
}
