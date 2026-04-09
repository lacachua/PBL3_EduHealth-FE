import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';

export const shouldUseMockInventoryApi = (moduleKey = DATA_MODULES.ADMIN_MEDICINES) => {
	return resolveModuleDataSource(moduleKey) === 'mock';
};

export const waitForInventoryMock = () => waitForMock('adminDashboard');
