import React from 'react';
import { Button, Stack, Menu, MenuItem } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportToJSON, exportToCSV, isFeatureEnabled } from '../../utils/adminHelpers';

/**
 * Data export component (#29, #30)
 * Supports JSON and CSV export
 */
export default function DataExport({ data, filename = 'export' }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Button
        startIcon={<FileDownloadIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        variant="outlined"
        size="small"
      >
        Exporter
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {isFeatureEnabled('CSV_EXPORT') && (
          <MenuItem
            onClick={() => {
              exportToCSV(data, `${filename}.csv`);
              setAnchorEl(null);
            }}
          >
            CSV
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            exportToJSON(data, `${filename}.json`);
            setAnchorEl(null);
          }}
        >
          JSON
        </MenuItem>
      </Menu>
    </>
  );
}
