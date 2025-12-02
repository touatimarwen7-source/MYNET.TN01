import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { procurementAPI } from "../api/procurementAPI";
import { setPageTitle } from "../utils/pageTitle";
import AsyncViewWrapper from "../components/AsyncViewWrapper";

/**
 * A page for buyers to see a list of their completed orders that are pending a review.
 */
const ReviewableOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPageTitle("Évaluer les Fournisseurs");
    const fetchOrders = async () => {
      try {
        const response = await procurementAPI.getReviewableOrders();
        setOrders(response.data.orders || []);
      } catch (err) {
        setError("Erreur lors du chargement des commandes à évaluer.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <AsyncViewWrapper loading={loading} error={error}>
      <Box
        sx={{ backgroundColor: "background.default", paddingY: "40px", minHeight: "100vh" }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, color: "primary.main" }}>
            Évaluer les Transactions Complétées
          </Typography>
          <Card sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: "none" }}>
            <CardContent>
              {orders.length === 0 ? (
                <Alert severity="info">
                  Vous n'avez aucune commande en attente d'évaluation.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="reviewable orders table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Numéro du BC</TableCell>
                        <TableCell>Fournisseur</TableCell>
                        <TableCell>Date de Complétion</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <strong>{order.poNumber}</strong>
                          </TableCell>
                          <TableCell>{order.supplier.name}</TableCell>
                          <TableCell>
                            {new Date(order.completedAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => navigate(`/submit-review/${order.id}`)}
                            >
                              Laisser un avis
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AsyncViewWrapper>
  );
};

export default ReviewableOrdersPage;
