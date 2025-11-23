import { Box, Skeleton, Stack, Card } from '@mui/material';

export function CardSkeleton({ rows = 3 }) {
  return (
    <Card sx={{ border: '1px solid #e0e0e0' }}>
      <Box sx={{ padding: '24px' }}>
        <Skeleton variant="text" height={28} width="60%" sx={{ marginBottom: '12px' }} />
        <Skeleton variant="text" height={16} width="100%" sx={{ marginBottom: '8px' }} />
        <Skeleton variant="text" height={16} width="90%" sx={{ marginBottom: '16px' }} />
        {Array.from({ length: rows - 1 }).map((_, idx) => (
          <Stack key={idx} spacing={1} sx={{ marginTop: '16px' }}>
            <Skeleton variant="text" height={14} width="40%" />
            <Skeleton variant="text" height={14} width="100%" />
          </Stack>
        ))}
      </Box>
    </Card>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, idx) => (
              <th key={idx} style={{ padding: '16px', textAlign: 'left' }}>
                <Skeleton variant="text" height={16} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} style={{ backgroundColor: rowIdx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} style={{ padding: '12px 16px' }}>
                  <Skeleton variant="text" height={14} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export function GridSkeleton({ items = 6 }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '16px' }}>
      {Array.from({ length: items }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </Box>
  );
}

export function FormSkeleton() {
  return (
    <Stack spacing={3}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Box key={idx}>
          <Skeleton variant="text" height={16} width="30%" sx={{ marginBottom: '8px' }} />
          <Skeleton variant="rectangular" height={40} />
        </Box>
      ))}
    </Stack>
  );
}
