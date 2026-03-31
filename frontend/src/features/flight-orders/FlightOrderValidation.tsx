import React from 'react';
import { Stack, Alert } from '@mui/material';
import type { FlightOrderFormData } from './flightOrderSchema';
import type { Helicopter, CrewMember } from '../../api/types';

interface FlightOrderValidationProps {
  flightOrder: FlightOrderFormData;
  helicopter?: Helicopter;
  pilot?: CrewMember;
  crewMembers?: CrewMember[];
  crewWeight: number;
}

const FlightOrderValidation: React.FC<FlightOrderValidationProps> = ({
  flightOrder,
  helicopter,
  pilot,
  crewMembers,
  crewWeight,
}) => {
  const warnings: string[] = [];

  const flightDay = flightOrder.plannedStartDateTime
    ? flightOrder.plannedStartDateTime.slice(0, 10)
    : '';

  // 1. Helicopter inspection expired on flight day
  if (helicopter && flightDay && helicopter.inspectionExpiryDate) {
    if (helicopter.inspectionExpiryDate < flightDay) {
      warnings.push('Helikopter nie ma ważnego przeglądu na dzień lotu');
    }
  }

  // 2. Pilot license expired on flight day
  if (pilot && flightDay && pilot.licenseExpiryDate) {
    if (pilot.licenseExpiryDate < flightDay) {
      warnings.push('Pilot nie ma ważnej licencji na dzień lotu');
    }
  }

  // 3. Crew member training expired
  if (crewMembers && flightDay) {
    for (const member of crewMembers) {
      if (member.trainingExpiryDate && member.trainingExpiryDate < flightDay) {
        warnings.push(
          `Członek załogi ${member.firstName} ${member.lastName} nie ma ważnego szkolenia na dzień lotu`,
        );
      }
    }
  }

  // 4. Crew weight exceeds helicopter max
  if (helicopter && crewWeight > helicopter.maxCrewWeight) {
    warnings.push('Waga załogi przekracza maksymalny udźwig helikoptera');
  }

  // 5. Route distance exceeds helicopter range
  if (
    helicopter &&
    flightOrder.estimatedRouteDistance > helicopter.rangeWithoutLanding
  ) {
    warnings.push('Szacowana długość trasy przekracza zasięg helikoptera');
  }

  if (warnings.length === 0) return null;

  return (
    <Stack spacing={1}>
      {warnings.map((warning, idx) => (
        <Alert key={idx} severity="warning">
          {warning}
        </Alert>
      ))}
    </Stack>
  );
};

export default FlightOrderValidation;
