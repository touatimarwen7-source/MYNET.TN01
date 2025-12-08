
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  ShowChart as ShowChartIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AIRecommendations() {
  const [tabValue, setTabValue] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [marketTrends, setMarketTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecommendations();
  }, [tabValue]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      if (tabValue === 0) {
        const response = await api.get('/ai/recommendations/tenders');
        setRecommendations(response.data.recommendations || []);
      } else {
        const response = await api.get('/ai/recommendations/market/trends');
        setMarketTrends(response.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des recommandations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 45) return 'warning';
    return 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PsychologyIcon fontSize="large" color="primary" />
          Recommandations Intelligentes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyse propulsée par l'IA pour optimiser vos décisions
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Appels d'offres recommandés" icon={<TrophyIcon />} iconPosition="start" />
        <Tab label="Tendances du marché" icon={<TrendingUpIcon />} iconPosition="start" />
      </Tabs>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && tabValue === 0 && (
        <Grid container spacing={3}>
          {recommendations.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                Aucune recommandation disponible pour le moment
              </Alert>
            </Grid>
          ) : (
            recommendations.map((rec) => (
              <Grid item xs={12} md={6} key={rec.tenderId}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                  onClick={() => navigate(`/tenders/${rec.tenderId}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ flex: 1 }}>
                        {rec.title}
                      </Typography>
                      <Chip
                        label={`${rec.score}%`}
                        color={getScoreColor(rec.score)}
                        size="small"
                        icon={<SpeedIcon />}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={rec.category} 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={`${rec.currentOffers} offres`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="body2" color="primary" gutterBottom>
                      {rec.recommendation}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Analyse détaillée:
                      </Typography>
                      
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Catégorie</Typography>
                          <Typography variant="caption">{rec.breakdown.categoryMatch}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={rec.breakdown.categoryMatch} 
                          sx={{ mb: 1 }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Budget</Typography>
                          <Typography variant="caption">{rec.breakdown.budgetFit}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={rec.breakdown.budgetFit} 
                          sx={{ mb: 1 }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Concurrence</Typography>
                          <Typography variant="caption">{rec.breakdown.competitionLevel}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={rec.breakdown.competitionLevel} 
                          sx={{ mb: 1 }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Urgence</Typography>
                          <Typography variant="caption">{rec.breakdown.urgency}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={rec.breakdown.urgency} 
                        />
                      </Box>
                    </Box>

                    <Button 
                      fullWidth 
                      variant="contained" 
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tenders/${rec.tenderId}/submit-offer`);
                      }}
                    >
                      Soumettre une offre
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {!loading && tabValue === 1 && marketTrends && (
        <Grid container spacing={3}>
          {marketTrends.trends.map((trend, idx) => (
            <Grid item xs={12} md={6} lg={4} key={idx}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {trend.category}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ShowChartIcon 
                      color={trend.trend === 'increasing' ? 'success' : 'error'} 
                    />
                    <Typography 
                      variant="body2" 
                      color={trend.trend === 'increasing' ? 'success.main' : 'error.main'}
                    >
                      Tendance {trend.trend === 'increasing' ? 'haussière' : 'baissière'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total appels d'offres: <strong>{trend.metrics.totalTenders}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Budget moyen: <strong>{trend.metrics.avgBudget} TND</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Offres moyennes: <strong>{trend.metrics.avgOffersPerTender}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Niveau de concurrence: <strong>{trend.metrics.competitionLevel}</strong>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default AIRecommendations;
