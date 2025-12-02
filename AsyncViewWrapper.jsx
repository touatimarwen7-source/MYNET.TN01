import React from 'react';
import { Box, CircularProgress, Container, Alert } from '@mui/material';

/**
 * A wrapper component to handle common async states (loading, error).
 * It displays a loading indicator, an error message, or the children content.
 * @param {object} props
 * @param {boolean} props.loading - The loading state.
 * @param {string | null} props.error - The error message.
 * @param {React.ReactNode} props.children - The content to render on success.
 */
const AsyncViewWrapper = ({ loading, error, children }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return <>{children}</>;
};

export default AsyncViewWrapper;