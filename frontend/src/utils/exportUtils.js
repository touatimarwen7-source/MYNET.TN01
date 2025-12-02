// Export utilities for data export (JSON, CSV)

export const exportToJSON = (data, filename = 'export.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadFile(blob, filename);
};

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!Array.isArray(data) || data.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, filename);
};

const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const prepareDataForExport = (items, fields) => {
  return items.map((item) =>
    fields.reduce((acc, field) => {
      acc[field.label] = item[field.key];
      return acc;
    }, {})
  );
};
