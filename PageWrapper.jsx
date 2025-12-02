import React from 'react';
import { Box, Container, Typography } from '@mui/material';

/**
 * A reusable wrapper component that provides a consistent page layout.
 * It includes a standard background, container, and a main title.
 * @param {object} props
 * @param {string} props.title - The main title to display on the page.
 * @param {React.ReactNode} props.children - The content of the page.
 */
const PageWrapper = ({ title, children }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        paddingY: '40px',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
          {title}
        </Typography>
        {children}
      </Container>
    </Box>
  );
};

export default PageWrapper;