import * as signalR from '@microsoft/signalr';
import { env } from '../../app/config/env';
import { getAccessToken } from '../services/tokenClient';

const buildHubUrl = (hubPath) => {
  if (!hubPath) {
    return '';
  }

  if (/^https?:\/\//i.test(hubPath)) {
    return hubPath;
  }

  const baseUrl = env.apiBaseUrl || '';
  return `${baseUrl}${hubPath}`;
};

export const createSignalRConnection = ({ hubPath, accessTokenFactory } = {}) => {
  const url = buildHubUrl(hubPath);
  const tokenFactory = accessTokenFactory || getAccessToken;

  return new signalR.HubConnectionBuilder()
    .withUrl(url, {
      accessTokenFactory: () => tokenFactory() || '',
    })
    .withAutomaticReconnect()
    .build();
};
