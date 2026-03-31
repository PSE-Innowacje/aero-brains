import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import PeopleIcon from '@mui/icons-material/People';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LockIcon from '@mui/icons-material/Lock';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../auth/AuthContext';
import { canAccessMenu } from '../shared/utils/permissions';
import { menuConfig } from './MenuConfig';

const DRAWER_WIDTH = 260;

const iconMap: Record<string, React.ReactElement> = {
  '/helicopters': <FlightIcon />,
  '/crew': <PeopleIcon />,
  '/landing-sites': <FlightLandIcon />,
  '/users': <LockIcon />,
  '/operations': <AssignmentIcon />,
  '/flight-orders': <DescriptionIcon />,
};

const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabelMap: Record<string, string> = {
    admin: 'Administrator',
    planner: 'Planista',
    supervisor: 'Nadzorca',
    pilot: 'Pilot',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            AERO
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">
                {user.firstName} {user.lastName} ({roleLabelMap[user.role] ?? user.role})
              </Typography>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Wyloguj
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#fafafa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', pt: 1 }}>
          {menuConfig
            .filter((group) => user && canAccessMenu(user.role, group.menuKey))
            .map((group) => (
              <List
                key={group.menuKey}
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{
                      bgcolor: 'transparent',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'text.secondary',
                      lineHeight: '36px',
                      mt: 1,
                    }}
                  >
                    {group.label}
                  </ListSubheader>
                }
              >
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path ||
                    location.pathname.startsWith(item.path + '/');
                  return (
                    <ListItemButton
                      key={item.path}
                      selected={isActive}
                      onClick={() => navigate(item.path)}
                      sx={{
                        mx: 1,
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          bgcolor: '#e3f2fd',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'primary.contrastText',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: isActive ? 'inherit' : 'text.secondary',
                        }}
                      >
                        {iconMap[item.path] ?? <AssignmentIcon />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            ))}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 8 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppShell;
