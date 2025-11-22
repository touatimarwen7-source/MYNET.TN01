import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import StorageIcon from '@mui/icons-material/Storage';
import ErrorIcon from '@mui/icons-material/Error';

export default function AdminAnalytics() {
  const stats = [
    { label: 'Utilisateurs Actifs', value: '1,254', change: '+12%', icon: <PeopleIcon />, color: '#0056B3' },
    { label: 'Appels d\'Offres', value: '342', change: '+8%', icon: <TrendingUpIcon />, color: '#2E7D32' },
    { label: 'Offres Soumises', value: '1,847', change: '+25%', icon: <StorageIcon />, color: '#F57C00' },
    { label: 'Erreurs Système', value: '3', change: '-2%', icon: <ErrorIcon />, color: '#C62828' },
  ];

  const activities = [
    { event: 'Nouvel utilisateur inscrit', timestamp: 'Il y a 2 heures', user: 'Société XYZ' },
    { event: 'Appel d\'offres créé', timestamp: 'Il y a 5 heures', user: 'Admin' },
    { event: 'Offre soumise', timestamp: 'Il y a 8 heures', user: 'Société ABC' },
    { event: 'Système sauvegardé', timestamp: 'Aujourd'hui 02:30', user: 'Système' },
  ];

  return (
    <Box>
      <Grid container spacing={2} sx={{ marginBottom: '32px' }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <Box sx={{ fontSize: '28px', color: stat.color }}>{stat.icon}</Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#2E7D32' }}>
                    {stat.change}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '4px' }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#616161' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '16px' }}>
        Utilisation des Ressources
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: '32px' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid #E0E0E0' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: '#616161', display: 'block', marginBottom: '8px' }}>
                Utilisation CPU
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress variant="determinate" value={65} sx={{ height: '6px', borderRadius: '4px' }} />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>65%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid #E0E0E0' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: '#616161', display: 'block', marginBottom: '8px' }}>
                Mémoire
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress variant="determinate" value={48} sx={{ height: '6px', borderRadius: '4px' }} />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>48%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid #E0E0E0' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: '#616161', display: 'block', marginBottom: '8px' }}>
                Stockage
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress variant="determinate" value={72} sx={{ height: '6px', borderRadius: '4px' }} />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>72%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ border: '1px solid #E0E0E0' }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: '#616161', display: 'block', marginBottom: '8px' }}>
                Bande Passante
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress variant="determinate" value={42} sx={{ height: '6px', borderRadius: '4px' }} />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>42%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '16px' }}>
        Activités Récentes
      </Typography>

      <Paper sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>Événement</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>Utilisateur</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>Heure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity, idx) => (
              <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#F9F9F9' } }}>
                <TableCell sx={{ fontSize: '13px' }}>{activity.event}</TableCell>
                <TableCell sx={{ fontSize: '13px' }}>{activity.user}</TableCell>
                <TableCell sx={{ fontSize: '13px', color: '#616161' }}>{activity.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
