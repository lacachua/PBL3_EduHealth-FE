import { DATA_MODULES, resolveModuleDataSource } from '../../../app/config/dataMode';
import { waitForMock } from '../../../shared/config/runtimeConfig';
import {
  adaptContactsResponse,
  adaptConversationDetailResponse,
  adaptConversationsResponse,
  adaptMessagesResponse,
} from '../adapters/messagingAdapter';
import {
  createConversationMockEnvelope,
  getConversationDetailMockEnvelope,
  getConversationsMockEnvelope,
  getMessagesMockEnvelope,
  getNurseContactsMockEnvelope,
  getStudentContactsMockEnvelope,
  markConversationReadMockEnvelope,
} from '../mocks/messagingMock';
import { messagingApi } from '../services/messagingApi';

const isMockSource = () => resolveModuleDataSource(DATA_MODULES.MESSAGING) === 'mock';

const getConversationsLive = async (query) => messagingApi.getConversations(query);
const getConversationDetailLive = async (conversationId) => messagingApi.getConversationDetail(conversationId);
const getMessagesLive = async (conversationId, query) => messagingApi.getMessages(conversationId, query);
const createConversationLive = async (payload) => messagingApi.createConversation(payload);
const markReadLive = async (conversationId, payload) => messagingApi.markConversationRead(conversationId, payload);
const getStudentContactsLive = async (query) => messagingApi.getStudentContacts(query);
const getNurseContactsLive = async (query) => messagingApi.getNurseContacts(query);

const getConversationsMock = async (query) => {
  await waitForMock('messaging');
  return getConversationsMockEnvelope(query);
};

const getConversationDetailMock = async (conversationId, query) => {
  await waitForMock('messaging');
  return getConversationDetailMockEnvelope(conversationId, query);
};

const getMessagesMock = async (conversationId, query) => {
  await waitForMock('messaging');
  return getMessagesMockEnvelope({ conversationId, ...query });
};

const createConversationMock = async (payload, query) => {
  await waitForMock('messaging');
  return createConversationMockEnvelope(payload, query);
};

const markReadMock = async () => {
  await waitForMock('messaging');
  return markConversationReadMockEnvelope();
};

const getStudentContactsMock = async (query) => {
  await waitForMock('messaging');
  return getStudentContactsMockEnvelope(query);
};

const getNurseContactsMock = async (query) => {
  await waitForMock('messaging');
  return getNurseContactsMockEnvelope(query);
};

export const messagingRepository = {
  getConversations: async (query = {}, context = {}) => {
    const envelope = isMockSource()
      ? await getConversationsMock(query)
      : await getConversationsLive(query);

    return adaptConversationsResponse(envelope, {
      currentUser: context.currentUser,
      page: query.page,
      pageSize: query.pageSize,
    });
  },

  getConversationDetail: async (conversationId, context = {}) => {
    const envelope = isMockSource()
      ? await getConversationDetailMock(conversationId, context)
      : await getConversationDetailLive(conversationId);

    return adaptConversationDetailResponse(envelope, { currentUser: context.currentUser });
  },

  getMessages: async (conversationId, query = {}, context = {}) => {
    const envelope = isMockSource()
      ? await getMessagesMock(conversationId, query)
      : await getMessagesLive(conversationId, query);

    return adaptMessagesResponse(envelope, {
      currentUser: context.currentUser,
      page: query.page,
      pageSize: query.pageSize,
    });
  },

  createConversation: async (payload, context = {}) => {
    const envelope = isMockSource()
      ? await createConversationMock(payload, context)
      : await createConversationLive(payload);

    return adaptConversationDetailResponse(envelope, { currentUser: context.currentUser });
  },

  markConversationRead: async (conversationId, payload) => {
    if (isMockSource()) {
      return markReadMock();
    }

    return markReadLive(conversationId, payload);
  },

  getStudentContacts: async (query = {}, context = {}) => {
    const envelope = isMockSource()
      ? await getStudentContactsMock(query)
      : await getStudentContactsLive(query);

    return adaptContactsResponse(envelope, {
      currentUser: context.currentUser,
      page: query.page,
      pageSize: query.pageSize,
    });
  },

  getNurseContacts: async (query = {}, context = {}) => {
    const envelope = isMockSource()
      ? await getNurseContactsMock(query)
      : await getNurseContactsLive(query);

    return adaptContactsResponse(envelope, {
      currentUser: context.currentUser,
      page: query.page,
      pageSize: query.pageSize,
    });
  },
};
