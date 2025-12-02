import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Paper,
  TableRow,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import { procurementAPI } from '../api/procurementAPI';
import { setPageTitle } from '../utils/pageTitle';
import AsyncViewWrapper from '../components/AsyncViewWrapper';

/**
 * A page that lists all purchase orders for the current supplier,
 * allowing them to create invoices for eligible orders.
 */
const PurchaseOrdersListPage = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPageTitle('Mes Bons de Commande');
    const fetchPurchaseOrders = async () => {
      try {
        const response = await procurementAPI.getMyPurchaseOrders();
        setPurchaseOrders(response.data.purchaseOrders || []);
      } catch (err) {
        setError('Erreur lors du chargement des bons de commande.');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseOrders();
  }, []);

  const getStatusChip = (status) => {
    const statusMap = {
      'Approved': { label: 'Approuvé', color: 'primary' },
      'Invoiced': { label: 'Facturé', color: 'warning' },
      'Paid': { label: 'Payé', color: 'success' },
      'Cancelled': { label: 'Annulé', color: 'error' },
    };
    const { label, color } = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={label} color={color} size="small" />;
  };

  return (
    <AsyncViewWrapper loading={loading} error={error}>
      <Box sx={{ backgroundColor: 'background.default', paddingY: '40px', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
            Mes Bons de Commande
          </Typography>
          <Card sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
            <CardContent>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Numéro du BC</TableCell>
                      <TableCell>Acheteur</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Montant Total</TableCell>
                      <TableCell align="center">Statut</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell><strong>{po.purchaseOrderNumber}</strong></TableCell>
                        <TableCell>{po.buyer.name}</TableCell>
                        <TableCell>{new Date(po.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell align="right">{new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(po.totalPrice)}</TableCell>
                        <TableCell align="center">{getStatusChip(po.status)}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigate(`/create-invoice/${po.id}`)}
                            disabled={po.status !== 'Approved'} // Only allow invoicing for approved POs
                          >
                            Créer une facture
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AsyncViewWrapper>
  );
};

export default PurchaseOrdersListPage;