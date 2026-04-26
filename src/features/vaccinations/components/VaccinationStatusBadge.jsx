

import StatusBadge from '../../../shared/components/core/StatusBadge';
import { VACCINATION_STATUS_META, CAMPAIGN_STATUS_META } from '../constants/vaccinationConstants';

const statusToToneMap = {
  // Vaccination statuses
  'bg-warning-soft text-warning': 'warning',
  'bg-success-soft text-success': 'success',
  'bg-danger-soft text-danger': 'danger',
  'bg-surface-container-low text-on-surface-variant': 'neutral',
  // Campaign statuses
  'bg-info-soft text-info': 'info',
};

const VaccinationStatusBadge = ({ label, className }) => {
  const tone = statusToToneMap[className] || 'neutral';

  return <StatusBadge tone={tone}>{label}</StatusBadge>;
};

export default VaccinationStatusBadge;
