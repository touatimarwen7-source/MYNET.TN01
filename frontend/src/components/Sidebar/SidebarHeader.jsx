import { Avatar, Box, Typography } from '@mui/material';
import { THEME_COLORS } from '../themeHelpers';
import institutionalTheme from '../../theme/theme';

/**
 * Sidebar header displaying user profile information
 */
export default function SidebarHeader({ user }) {
  const theme = institutionalTheme;

  const getRoleLabel = (role) => {
    const roleMap = {
      buyer: 'Acheteur',
      supplier: 'Fournisseur',
      super_admin: 'Super Admin',
      admin: 'Admin',
    };
    return roleMap[role] || 'Utilisateur';
  };

  return (
    <Box sx={{ padding: '24px 16px', borderBottom: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            backgroundColor: theme.palette.primary.main,
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.email || 'Utilisateur'}
          </Typography>
          <Typography variant="caption" sx={{ color: THEME_COLORS.textSecondary }}>
            {getRoleLabel(user?.role)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
