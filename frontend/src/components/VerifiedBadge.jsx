import { Box, Tooltip, Typography } from '@mui/material';
import { THEME_COLORS } from './themeHelpers';

export default function VerifiedBadge({ size = 'md', showText = true }) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <Tooltip title="Cette ressource a été vérifiée">
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'default'
        }}
      >
        <Box sx={{ fontSize: sizeMap[size] }}>
          ✓
        </Box>
        {showText && (
          <Typography variant="caption" sx={{ fontWeight: 600, color: THEME_COLORS.success }}>
            Vérifiée
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}
