/**
 * WebSocket Integration Example
 * Shows how to use real-time features in any component
 */

import { THEME_COLORS } from './themeHelpers';
import React, { useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import useWebSocket from '../hooks/useWebSocket';
import { institutionalTheme } from '../theme/theme';

export const WebSocketExample = ({ userId, tenderId }) => {
  const {
    connected,
    notifications,
    onlineUsers,
    joinTender,
    leaveTender,
    sendMessage,
    sendRating,
    removeNotification
  } = useWebSocket(userId);

  // Join tender room on mount
  useEffect(() => {
    if (tenderId) {
      joinTender(tenderId);
      return () => {
        leaveTender(tenderId);
      };
    }
  }, [tenderId, joinTender, leaveTender]);

  return (
    <Box sx={{ p: 2 }}>
      {/* Connection Status */}
      <Card sx={{ mb: 2, backgroundColor: connected ? '#E8F5E9' : '#FFEBEE' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '20px' }}>
              {connected ? '🟢' : '🔴'}
            </span>
            <Box>
              <Typography variant="h6">
                {connected ? 'Connecté' : 'Déconnecté'}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>
                {connected ? 'Prêt à recevoir les mises à jour en temps réel' : 'En reconnexion...'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              📬 Notifications ({notifications.length})
            </Typography>
            {notifications.map((notif) => (
              <Card
                key={notif.id}
                sx={{
                  mb: 1,
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#eeeeee' }
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {notif.icon} {notif.title}
                      </div>
                      <div style={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>
                        {notif.message}
                      </div>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => removeNotification(notif.id)}
                    >
                      ✕
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Online Users */}
      {onlineUsers.size > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              👥 المستخدمون الآن على الإنترنت ({onlineUsers.size})
            </Typography>
            <Typography sx={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>
              {Array.from(onlineUsers).join(', ')}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Sample Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ⚙️ إجراءات العينة
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => sendMessage('user123', 'مرحبا! هل تمام؟', 'أنت')}
              disabled={!connected}
            >
              إرسال رسالة
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => sendRating('supplier123', 5, 'أنت', 'ممتاز!')}
              disabled={!connected}
            >
              إرسال تقييم ⭐
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WebSocketExample;
