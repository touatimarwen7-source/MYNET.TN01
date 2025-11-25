import { Box, Typography, TextField, Stack, Alert } from '@mui/material';

export default function StepFive({ formData, handleChange, totalCriteria, loading }) {
  const criteria = [
    { key: 'price', label: 'Prix' },
    { key: 'quality', label: 'Qualité' },
    { key: 'delivery', label: 'Délai de Livraison' },
    { key: 'experience', label: 'Expérience' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Alert severity="info" sx={{ backgroundColor: '#E3F2FD', color: '#0056B3' }}>
        ℹ️ Distribuer 100 points entre les critères. Total actuel: <strong>{totalCriteria}%</strong>
      </Alert>

      <Stack spacing={2}>
        {criteria.map((c) => (
          <Box key={c.key}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '8px' }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121' }}>
                {c.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color:
                    formData.evaluation_criteria[c.key] > 0 ? '#0056B3' : '#999999',
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  backgroundColor: '#FAFAFA',
                },
              }}
            />
          </Box>
        ))}
      </Stack>

      {totalCriteria === 100 && (
        <Alert severity="success" sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
          ✅ Critères correctement distribués
        </Alert>
      )}

      {totalCriteria !== 100 && totalCriteria > 0 && (
        <Alert severity="warning" sx={{ backgroundColor: '#FFF3CD', color: '#856404' }}>
          ⚠️ Le total doit être exactement 100% (actuel: {totalCriteria}%)
        </Alert>
      )}
    </Box>
  );
}
