
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

export default function SupplierProductsManagement() {
  const theme = institutionalTheme;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setPageTitle('Gestion des Produits - Fournisseur');
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
                Gestion des Produits
              </Typography>
              <Button variant="contained" startIcon={<Add />}>
                Ajouter Produit
              </Button>
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom du Produit</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>Prix</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary" sx={{ py: 4 }}>
                          Aucun produit disponible. Cliquez sur "Ajouter Produit" pour commencer.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price} DT</TableCell>
                        <TableCell>{product.stock}</TableCell>
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
