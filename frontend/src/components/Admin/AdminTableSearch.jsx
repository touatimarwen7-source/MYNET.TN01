import { TextField, Box } from '@mui/material';

/**
 * Search input component for AdminTable
 */
export default function AdminTableSearch({ value, onChange, placeholder = 'Rechercher...' }) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        sx={{ width: '100%' }}
      />
    </Box>
  );
}
