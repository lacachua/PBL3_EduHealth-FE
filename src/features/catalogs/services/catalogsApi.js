import { catalogsRepository } from '../repositories/catalogsRepository';

export const getCatalogGroupsApi = async () => {
  return catalogsRepository.getGroups();
};

export const getCatalogListApi = async (query = {}) => {
  return catalogsRepository.getList(query);
};

export const getCatalogDetailApi = async (catalogId, query = {}) => {
  return catalogsRepository.getDetail(catalogId, query);
};
