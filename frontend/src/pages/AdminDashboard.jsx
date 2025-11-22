import { useState, useEffect } from 'react';
import { Container, Box, Tabs, Tab, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import UserRoleManagement from '../components/Admin/UserRoleManagement';
import ContentManager from '../components/Admin/ContentManager';
import SystemConfig from '../components/Admin/SystemConfig';
import AdminAnalytics from '../components/Admin/AdminAnalytics';
import { setPageTitle } from '../utils/pageTitle';

/**
 * Admin Dashboard - Total Control Hub
 * Comprehensive admin interface for managing users, content, system config, and analytics
 */
export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    setPageTitle('Tableau de Bord Administrateur');
  }, []);

  const tabs = [
    { label: 'Utilisateurs & Rôles', icon: <SecurityIcon />, component: <UserRoleManagement /> },
    { label: 'Gestion du Contenu', icon: <ArticleIcon />, component: <ContentManager /> },
    { label: 'Configuration', icon: <SettingsIcon />, component: <SystemConfig /> },
    { label: 'Analytique', icon: <AnalyticsIcon />, component: <AdminAnalytics /> }
  ];

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: '32px',
            fontWeight: 500,
            color: '#212121',
            marginBottom: '32px',
          }}
        >
          Tableau de Bord Administrateur
        </Typography>

        <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E0E0E0' }}>
          <Tabs
            value={currentTab}
            onChange={(e, value) => setCurrentTab(value)}
            sx={{
              borderBottom: '1px solid #E0E0E0',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                color: '#616161',
                '&.Mui-selected': {
                  color: '#0056B3',
                  borderBottom: '3px solid #0056B3'
                }
              }
            }}
          >
            {tabs.map((tab, idx) => (
              <Tab
                key={idx}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{ minWidth: '200px' }}
              />
            ))}
          </Tabs>

          <Box sx={{ padding: '24px' }}>
            {tabs[currentTab].component}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
