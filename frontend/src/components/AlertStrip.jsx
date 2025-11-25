import { useState, useEffect } from 'react';
import { Alert, Box, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { THEME_COLORS } from './themeHelpers';

export default function AlertStrip() {
  const [alerts, setAlerts] = useState([]);
  const [visibleAlerts, setVisibleAlerts] = useState(new Set());

  useEffect(() => {
    // No alerts to display by default
    setAlerts([]);
    setVisibleAlerts(new Set());
  }, []);

  const closeAlert = (id) => {
    const newVisibleAlerts = new Set(visibleAlerts);
    newVisibleAlerts.delete(id);
    setVisibleAlerts(newVisibleAlerts);
  };

  const closeAllAlerts = () => {
    setVisibleAlerts(new Set());
  };

  // Don't render if no visible alerts
  if (visibleAlerts.size === 0) return null;

  const getAlertBorderColor = (type) => {
    const colorMap = {
      success: THEME_COLORS.success,
      warning: THEME_COLORS.warning,
      error: THEME_COLORS.error,
      info: THEME_COLORS.primary,
    };
    return colorMap[type] || THEME_COLORS.primary;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: THEME_COLORS.bgPaper,
        borderBottom: `1px solid ${THEME_COLORS.divider}`,
        padding: '8px 16px',
      }}
    >
      <Stack spacing={1}>
        {alerts.map(
          (alert) =>
            visibleAlerts.has(alert.id) && (
              <Alert
                key={alert.id}
                severity={alert.type}
                onClose={() => closeAlert(alert.id)}
                sx={{
                  border: '1px solid',
                  borderColor: getAlertBorderColor(alert.type),
                  borderRadius: '4px',
                }}
              >
                <strong>{alert.title}</strong> {alert.message}
              </Alert>
            )
        )}
        {visibleAlerts.size > 1 && (
          <Box sx={{ textAlign: 'right' }}>
            <IconButton
              size="small"
              onClick={closeAllAlerts}
              sx={{
                color: THEME_COLORS.textSecondary,
                fontSize: '12px',
                '&:hover': { backgroundColor: THEME_COLORS.bgDefault },
              }}
            >
              Fermer tout
            </IconButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
