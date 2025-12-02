import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Box, Typography, Button, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export default function TenderCard({ tender, onView }) {
  const theme = useTheme();
  const navigate = useNavigate();

  if (!tender) return null;

  const handleViewClick = () => {
    if (onView) {
      onView(tender);
    } else {
      navigate(`/tender/${tender.id}`);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: 'none',
        },
      }}
      onClick={handleViewClick}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, mr: 2 }}>
            {tender.title || 'Sans titre'}
          </Typography>
          <Chip
            label={tender.status || 'Active'}
            size="small"
            color={tender.status === 'active' ? 'primary' : 'default'}
          />
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          {tender.description?.substring(0, 100) || 'Pas de description'}...
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="caption" color="textSecondary">
            {tender.deadline
              ? `Deadline: ${new Date(tender.deadline).toLocaleDateString('fr-FR')}`
              : 'Pas de deadline'}
          </Typography>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewClick();
            }}
            sx={{ color: theme.palette.primary.main }}
          >
            Voir
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

TenderCard.propTypes = {
  tender: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    deadline: PropTypes.string,
  }),
  onView: PropTypes.func,
};
