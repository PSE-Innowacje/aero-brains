import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../auth/AuthContext';
import { canAccessMenu } from '../shared/utils/permissions';
import { menuConfig } from './MenuConfig';

const DRAWER_WIDTH = 230;

// Icons matching the reference HTML file
const iconMap: Record<string, string> = {
  '/helicopters': '\u{1F681}',     // 🚁
  '/crew': '\u{1F464}',            // 👤
  '/landing-sites': '\u{1F6EC}',   // 🛬
  '/users': '\u{1F510}',           // 🔐
  '/operations': '\u{1F4CB}',      // 📋
  '/flight-orders': '\u{1F4DD}',   // 📝
};

const roleLabelMap: Record<string, string> = {
  ADMINISTRATOR: 'Administrator systemu',
  PLANNER: 'Osoba planująca',
  SUPERVISOR: 'Osoba nadzorująca',
  PILOT: 'Pilot',
};

function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#0d1f3c',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            px: 2,
            py: 2,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
          }}
        >
          <Box sx={{ fontSize: 22 }}>{'\u{1F681}'}</Box>
          <Box>
            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}
            >
              AERO
            </Typography>
            <Typography
              sx={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              Operacje lotnicze
            </Typography>
          </Box>
        </Box>

        {/* User area */}
        {user && (
          <Box
            sx={{
              px: 1.5,
              py: 1.2,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1,
                py: 0.75,
                borderRadius: '8px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: '#3b7ff5',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {getInitials(user.firstName, user.lastName)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.4)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {roleLabelMap[user.role] ?? user.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Navigation */}
        <Box sx={{ flex: 1, overflow: 'auto', pt: 1 }}>
          {menuConfig
            .filter((group) => user && canAccessMenu(user.role, group.menuKey))
            .map((group) => (
              <Box key={group.menuKey} sx={{ px: 1.5, py: 0.5 }}>
                {/* Section label */}
                <Typography
                  sx={{
                    fontSize: 9,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: 'rgba(255,255,255,0.25)',
                    px: 1,
                    mb: 0.6,
                    mt: 1,
                  }}
                >
                  {group.label}
                </Typography>

                {/* Nav items */}
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + '/');

                  return (
                    <Box
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        px: '10px',
                        py: '7px',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        mb: '1px',
                        fontSize: 13,
                        transition: 'all 0.15s',
                        color: isActive
                          ? '#6ea8fe'
                          : 'rgba(255,255,255,0.55)',
                        fontWeight: isActive ? 500 : 400,
                        bgcolor: isActive
                          ? 'rgba(59,127,245,0.2)'
                          : 'transparent',
                        '&:hover': {
                          bgcolor: isActive
                            ? 'rgba(59,127,245,0.2)'
                            : 'rgba(255,255,255,0.07)',
                          color: isActive
                            ? '#6ea8fe'
                            : 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}
                      >
                        {iconMap[item.path] ?? '\u{1F4CB}'}
                      </Box>
                      {item.label}
                    </Box>
                  );
                })}
              </Box>
            ))}
        </Box>

        {/* Logout at bottom */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ px: 1.5, py: 1.5 }}>
          <Button
            startIcon={<LogoutIcon sx={{ fontSize: '16px !important' }} />}
            onClick={handleLogout}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              color: 'rgba(255,255,255,0.45)',
              fontSize: 12,
              textTransform: 'none',
              borderRadius: '7px',
              px: '10px',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Wyloguj
          </Button>
        </Box>
      </Drawer>

      {/* ── Main content ── */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          bgcolor: '#e8edf3',
          minHeight: '100vh',
        }}
      >
        {/* Page content */}
        <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;
