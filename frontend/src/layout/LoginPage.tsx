import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';

const TEST_ACCOUNTS = [
  { email: 'admin@aero.pl', label: 'Administrator', icon: '\u{1F510}' },
  { email: 'planner@aero.pl', label: 'Osoba planująca', icon: '\u{1F4CB}' },
  { email: 'supervisor@aero.pl', label: 'Osoba nadzorująca', icon: '\u{1F441}' },
  { email: 'pilot@aero.pl', label: 'Pilot', icon: '\u2708\uFE0F' },
];

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('supervisor@aero.pl');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/operations');
      } else {
        setError('Nieprawidłowy email lub hasło');
      }
    } catch {
      setError('Nieprawidłowy email lub hasło');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (account: (typeof TEST_ACCOUNTS)[number]) => {
    setEmail(account.email);
    setPassword('password');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#e8edf3',
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%', mx: 2, borderRadius: '14px', border: '0.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ fontSize: 28, mb: 0.5 }}>{'\u{1F681}'}</Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
              AERO
            </Typography>
            <Typography sx={{ fontSize: 11, color: '#94a3b8', mt: 0.5 }}>
              Ewidencja operacji lotniczych
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <TextField
              label="Hasło"
              type="password"
              fullWidth
              margin="normal"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                bgcolor: '#3b7ff5',
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                py: 1,
                borderRadius: '7px',
                '&:hover': { bgcolor: '#2563eb' },
              }}
            >
              Zaloguj się
            </Button>
          </Box>

          <Divider sx={{ my: 3, fontSize: 10, color: '#94a3b8' }}>
            Szybkie logowanie
          </Divider>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {TEST_ACCOUNTS.map((account) => (
              <Box
                key={account.email}
                onClick={() => handleQuickLogin(account)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: '8px',
                  border: email === account.email
                    ? '1.5px solid #3b7ff5'
                    : '1px solid #e2e8f0',
                  bgcolor: email === account.email ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': {
                    borderColor: '#3b7ff5',
                    bgcolor: '#eff6ff',
                  },
                }}
              >
                <Box sx={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>
                  {account.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                    {account.label}
                  </Typography>
                  <Typography sx={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {account.email}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
