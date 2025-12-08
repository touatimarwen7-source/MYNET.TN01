
import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import institutionalTheme from '../theme/theme';
import { setPageTitle } from '../utils/pageTitle';

export default function SupplierServicesManagement() {
  const theme = institutionalTheme;
  const [services, setServices] = useState([]);

  useEffect(() => {
    setPageTitle('Gestion des Services - Fournisseur');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#fafafa', paddingY: '40px', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Card sx={{ border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ padding: '40px' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Gestion des Services
              </Typography>
              <Button variant="contained" startIcon={<Add />}>
                Ajouter Service
              </Button>
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom du Service</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>Tarif</TableCell>
                    <TableCell>Disponibilité</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary" sx={{ py: 4 }}>
                          Aucun service disponible. Cliquez sur "Ajouter Service" pour commencer.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.category}</TableCell>
                        <TableCell>{service.price} DT</TableCell>
                        <TableCell>{service.available ? 'Disponible' : 'Indisponible'}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
