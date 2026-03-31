import React, { useRef } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { parseKml, calculateRouteDistanceKm, type KmlPoint } from '../../shared/utils/kml';

interface KmlUploadProps {
  points: KmlPoint[];
  onPointsChange: (points: KmlPoint[], distanceKm: number) => void;
  disabled?: boolean;
  fileName?: string;
  onFileNameChange?: (name: string) => void;
}

const KmlUpload: React.FC<KmlUploadProps> = ({
  points,
  onPointsChange,
  disabled = false,
  fileName,
  onFileNameChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.kml')) {
      setError('Dozwolone są tylko pliki KML.');
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseKml(text);

      if (parsed.length === 0) {
        setError('Plik KML nie zawiera żadnych współrzędnych.');
        return;
      }

      if (parsed.length > 5000) {
        setError('Plik KML zawiera więcej niż 5000 punktów.');
        return;
      }

      const distance = calculateRouteDistanceKm(parsed);
      onPointsChange(parsed, distance);
      onFileNameChange?.(file.name);
    } catch {
      setError('Nie udało się odczytać pliku KML.');
    }

    // Reset input so the same file can be re-uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Plik KML — ślad trasy
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept=".kml"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        disabled={disabled}
      />

      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          {points.length > 0 ? 'Zmień plik KML' : 'Wgraj plik KML'}
        </Button>

        {fileName && (
          <Typography variant="body2" color="text.secondary">
            {fileName}
          </Typography>
        )}
      </Box>

      {points.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Załadowano {points.length} punktów
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default KmlUpload;
