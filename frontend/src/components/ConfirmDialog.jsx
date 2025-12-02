import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { THEME_COLORS } from './themeHelpers';
import institutionalTheme from '../theme/theme';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  severity = 'warning',
  loading = false,
}) {
  const theme = institutionalTheme;
  const severityColors = {
    warning: { title: 'THEME_COLORS.error', button: 'THEME_COLORS.error' },
    info: { title: theme.palette.primary.main, button: theme.palette.primary.main },
    success: { title: '#2e7d32', button: '#2e7d32' },
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: severityColors[severity].title, fontWeight: 600 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: THEME_COLORS.textSecondary, marginTop: '12px' }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{ backgroundColor: severityColors[severity].button }}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
