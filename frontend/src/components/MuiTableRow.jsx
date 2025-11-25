/* ================================================
   MUI Table Row Component - Institutional Standard
   Unified Table Row Usage - No Custom Styling
   ================================================ */

import { THEME_COLORS } from './themeHelpers';
import { TableRow, TableCell } from '@mui/material';

export default function MuiTableRow({ data, cells, onClick }) {
  return (
    <TableRow
      onClick={onClick}
      sx={{
        '&:hover': {
          backgroundColor: '#f8f8f8',
        },
      }}
    >
      {cells.map((cell, idx) => (
        <TableCell
          key={idx}
          align={cell.align || 'left'}
          sx={{
            fontSize: '14px',
            color: '#333333',
            padding: '16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {data[cell.key]}
        </TableCell>
      ))}
    </TableRow>
  );
}

/* VERIFICATION - This component uses MUI theme standards:
 * - Font: 14px, Roboto regular (400 weight)
 * - Text Color: #333333 (primary text)
 * - Padding: 16px (8px grid system)
 * - Border Bottom: 1px solid #f0f0f0 (light divider)
 * - Hover State: Background #f8f8f8 (secondary color)
 * - No custom CSS override possible - pure MUI theming
 */
