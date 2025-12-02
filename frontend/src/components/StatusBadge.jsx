import { Chip, Box } from '@mui/material';

const statusConfigs = {
  // Tender statuses
  draft: { label: 'Brouillon', color: 'default', icon: '📝' },
  published: { label: 'Publiée', color: 'info', icon: '📢' },
  closed: { label: 'Fermée', color: 'error', icon: '🔒' },
  awarded: { label: 'Attribuée', color: 'success', icon: '✓' },
  cancelled: { label: 'Annulée', color: 'error', icon: '✕' },
  under_evaluation: { label: 'En Évaluation', color: 'warning', icon: '⏳' },
  reopened: { label: 'Réouverte', color: 'info', icon: '🔄' },

  // Offer statuses
  submitted: { label: 'Soumise', color: 'info', icon: '✓' },
  accepted: { label: 'Acceptée', color: 'success', icon: '👍' },
  rejected: { label: 'Rejetée', color: 'error', icon: '👎' },
  shortlisted: { label: 'Sélectionnée', color: 'warning', icon: '⭐' },
  backup: { label: 'Secours', color: 'default', icon: '🔄' },

  // Active statuses
  active: { label: 'Active', color: 'success', icon: '✓' },
  inactive: { label: 'Inactive', color: 'default', icon: '◯' },
};

export default function StatusBadge({ status, variant = 'filled' }) {
  const config = statusConfigs[status] || statusConfigs.draft;

  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      color={config.color}
      variant={variant === 'filled' ? undefined : 'outlined'}
      size="small"
    />
  );
}
