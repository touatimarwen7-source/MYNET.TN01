/**
 * مكونات احترافية موحدة
 * مجموعة من المكونات القابلة لإعادة الاستخدام بمواصفات عالمية
 */

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Tooltip,
  Typography,
  Chip,
  Skeleton,
} from '@mui/material';
import { CheckCircle, Warning, Info } from '@mui/icons-material';
import institutionalTheme from '../theme/theme';

const THEME = institutionalTheme;

/**
 * مكون بطاقة معلومات محترفة
 */
export function InfoCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color = THEME.palette.primary.main,
}) {
  return (
    <Card
      sx={{
        backgroundColor: '#FFFFFF',
        border: `2px solid ${color}20`,
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 8px 24px ${color}15`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Stack flex={1}>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color, mt: 1 }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Stack>
            <Avatar
              sx={{
                backgroundColor: `${color}15`,
                width: 48,
                height: 48,
              }}
            >
              <Icon sx={{ color, fontSize: 24 }} />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * مكون تنبيه احترافي
 */
export function ProfessionalAlert({ type = 'info', title, message, icon: IconComponent }) {
  const getConfig = (type) => {
    const config = {
      success: {
        backgroundColor: '#2e7d3215',
        borderColor: '#2e7d32',
        textColor: '#1b5e20',
        icon: CheckCircle,
      },
      warning: {
        backgroundColor: '#f5760015',
        borderColor: '#f57c00',
        textColor: '#e65100',
        icon: Warning,
      },
      info: {
        backgroundColor: '#0288d115',
        borderColor: '#0288d1',
        textColor: '#01579b',
        icon: Info,
      },
      error: {
        backgroundColor: '#c6282815',
        borderColor: '#c62828',
        textColor: '#b71c1c',
        icon: Warning,
      },
    };
    return config[type] || config.info;
  };

  const config = getConfig(type);
  const Icon = IconComponent || config.icon;

  return (
    <Box
      sx={{
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      <Icon sx={{ color: config.textColor, mt: 0.5 }} />
      <Stack flex={1}>
        {title && (
          <Typography variant="body2" sx={{ fontWeight: 600, color: config.textColor }}>
            {title}
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: config.textColor, mt: title ? 0.5 : 0 }}>
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}

/**
 * مكون تقدم احترافي
 */
export function ProfessionalProgress({
  label,
  value,
  color = THEME.palette.primary.main,
  showPercentage = true,
}) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        {showPercentage && (
          <Chip
            label={`${value}%`}
            size="small"
            sx={{ backgroundColor: `${color}15`, color, fontWeight: 600 }}
          />
        )}
      </Stack>
      <Box
        sx={{
          height: '8px',
          borderRadius: '4px',
          backgroundColor: '#e0e0e0',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${value}%`,
            backgroundColor: color,
            borderRadius: '4px',
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
    </Stack>
  );
}

/**
 * مكون هيكل تحميل احترافي
 */
export function ProfessionalSkeleton({ variant = 'card', count = 1 }) {
  if (variant === 'card') {
    return (
      <Card sx={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Stack spacing={2}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="100%" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return Array.from({ length: count }).map((_, i) => (
    <Box key={i}>
      <Skeleton variant="rectangular" height={100} sx={{ mb: 1, borderRadius: '8px' }} />
    </Box>
  ));
}

/**
 * مكون رقاقة معلومات
 */
export function InfoChip({ label, value, icon: Icon, color = THEME.palette.primary.main }) {
  return (
    <Tooltip title={label}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: 2,
          py: 1,
          backgroundColor: `${color}15`,
          borderRadius: '8px',
          border: `1px solid ${color}30`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: `${color}25`,
            borderColor: color,
          },
        }}
      >
        {Icon && <Icon sx={{ color, fontSize: 18 }} />}
        <Stack direction="row" alignItems="baseline" spacing={0.5}>
          <Typography variant="caption" sx={{ fontWeight: 600, color }}>
            {value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {label}
          </Typography>
        </Stack>
      </Stack>
    </Tooltip>
  );
}
