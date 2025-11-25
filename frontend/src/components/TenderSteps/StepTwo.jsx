import { Box, Typography, TextField } from '@mui/material';

export default function StepTwo({ formData, handleChange, loading }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Publication Date */}
      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '8px' }}>
          Date de Publication *
        </Typography>
        <TextField
          fullWidth
          type="datetime-local"
          name="publication_date"
          value={formData.publication_date}
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

      {/* Deadline */}
      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '8px' }}>
          Date de Clôture *
        </Typography>
        <TextField
          fullWidth
          type="datetime-local"
          name="deadline"
          value={formData.deadline}
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

      {/* Opening Date */}
      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#212121', mb: '8px' }}>
          Date d'Ouverture
        </Typography>
        <TextField
          fullWidth
          type="datetime-local"
          name="opening_date"
          value={formData.opening_date}
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
    </Box>
  );
}
