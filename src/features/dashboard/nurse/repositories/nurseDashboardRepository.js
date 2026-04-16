import { DATA_MODULES, resolveModuleDataSource } from '../../../../app/config/dataMode';
import { normalizeApiMessage } from '../../../../shared/api/normalizeResponse';
import { waitForMock } from '../../../../shared/config/runtimeConfig';
import { getExaminations } from '../../../examinations/services/getExaminations';
import { getMedicineAlerts } from '../../../medicines/services/getMedicineAlerts';
import { nurseVaccinationsRepository } from '../../../vaccinations/repositories/nurseVaccinationsRepository';
import {
  NURSE_DASHBOARD_ACTIVE_CAMPAIGN_LIMIT,
  NURSE_DASHBOARD_EXAM_WINDOW_DAYS,
  NURSE_DASHBOARD_EXAM_WINDOW_PAGE_SIZE,
  NURSE_DASHBOARD_PENDING_LIMIT,
  NURSE_DASHBOARD_RECENT_EXAM_LIMIT,
  NURSE_DASHBOARD_SOURCE_KEYS,
} from '../constants/nurseDashboardConfig';
import { getNurseDashboardMockSnapshot } from '../mocks/nurseDashboardMock';

const isMockDashboardSource = () => resolveModuleDataSource(DATA_MODULES.NURSE_DASHBOARD) === 'mock';

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildExamWindowRange = () => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (NURSE_DASHBOARD_EXAM_WINDOW_DAYS - 1));
  startDate.setHours(0, 0, 0, 0);

  return {
    fromDate: toIsoDate(startDate),
    toDate: toIsoDate(endDate),
  };
};

const buildEmptySnapshot = () => ({
  source: 'live',
  generatedAt: new Date().toISOString(),
  sources: {
    [NURSE_DASHBOARD_SOURCE_KEYS.examinationsWindow]: null,
    [NURSE_DASHBOARD_SOURCE_KEYS.recentExaminations]: null,
    [NURSE_DASHBOARD_SOURCE_KEYS.medicineAlerts]: null,
    [NURSE_DASHBOARD_SOURCE_KEYS.pendingVaccinations]: null,
    [NURSE_DASHBOARD_SOURCE_KEYS.activeCampaigns]: null,
  },
  errors: {},
});

const createLiveRequests = () => {
  const examWindowRange = buildExamWindowRange();

  return {
    [NURSE_DASHBOARD_SOURCE_KEYS.examinationsWindow]: getExaminations({
      page: 1,
      pageSize: NURSE_DASHBOARD_EXAM_WINDOW_PAGE_SIZE,
      fromDate: examWindowRange.fromDate,
      toDate: examWindowRange.toDate,
    }),
    [NURSE_DASHBOARD_SOURCE_KEYS.recentExaminations]: getExaminations({
      page: 1,
      pageSize: NURSE_DASHBOARD_RECENT_EXAM_LIMIT,
    }),
    [NURSE_DASHBOARD_SOURCE_KEYS.medicineAlerts]: getMedicineAlerts(
      { type: 'ALL' },
      { moduleKey: DATA_MODULES.NURSE_MEDICINES }
    ),
    [NURSE_DASHBOARD_SOURCE_KEYS.pendingVaccinations]: nurseVaccinationsRepository.getPending({
      page: 1,
      pageSize: NURSE_DASHBOARD_PENDING_LIMIT,
    }),
    [NURSE_DASHBOARD_SOURCE_KEYS.activeCampaigns]: nurseVaccinationsRepository.getCampaigns({
      page: 1,
      pageSize: NURSE_DASHBOARD_ACTIVE_CAMPAIGN_LIMIT,
      status: 'ACTIVE',
    }),
  };
};

const composeLiveSnapshot = async () => {
  const snapshot = buildEmptySnapshot();
  const requests = createLiveRequests();
  const keys = Object.keys(requests);

  const settled = await Promise.allSettled(keys.map((key) => requests[key]));

  keys.forEach((key, index) => {
    const result = settled[index];
    if (result.status === 'fulfilled') {
      snapshot.sources[key] = result.value;
      return;
    }

    snapshot.errors[key] = normalizeApiMessage(result.reason);
  });

  snapshot.generatedAt = new Date().toISOString();
  return snapshot;
};

export const nurseDashboardRepository = {
  fetchSnapshot: async () => {
    if (isMockDashboardSource()) {
      await waitForMock('nurseDashboard');
      return getNurseDashboardMockSnapshot();
    }

    return composeLiveSnapshot();
  },
};
