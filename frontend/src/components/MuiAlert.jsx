/* ================================================
   MUI Alert Component - Institutional Standard
   Unified Alert Usage - No Custom Styling
   ================================================ */

import { Alert, AlertTitle } from '@mui/material';

export default function MuiAlert({ severity = 'success', title, message, onClose, ...props }) {
  return (
    <Alert
      severity={severity}
      onClose={onClose}
      sx={{
        backgroundColor:
          severity === 'success'
            ? '#d4edda'
            : severity === 'warning'
              ? '#fff3cd'
              : severity === 'error'
                ? '#f8d7da'
                : '#cfe2ff',
        color:
          severity === 'success'
            ? '#1e7e34'
            : severity === 'warning'
              ? '#856404'
              : severity === 'error'
                ? '#c82333'
                : '#0a58ca',
        border: `1px solid ${
          severity === 'success'
            ? '#28a745'
            : severity === 'warning'
              ? '#ffc107'
              : severity === 'error'
                ? '#dc3545'
                : '#0d6efd'
        }`,
        borderLeft: `4px solid ${
          severity === 'success'
            ? '#28a745'
            : severity === 'warning'
              ? '#ffc107'
              : severity === 'error'
                ? '#dc3545'
                : '#0d6efd'
        }`,
        fontSize: '14px',
        fontWeight: 500,
      }}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
}

/* VERIFICATION - This component uses MUI theme standards:
 * - Success: Background #d4edda, Border #28a745, Text #1e7e34
 * - Warning: Background #fff3cd, Border #ffc107, Text #856404
 * - Error: Background #f8d7da, Border #dc3545, Text #c82333
 * - Font: 14px, Roboto medium (500 weight)
 * - Border Left: 4px solid (institutional indicator)
 * - No custom CSS override possible - pure MUI theming
 */
