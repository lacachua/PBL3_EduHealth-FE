import * as signalR from '@microsoft/signalr';
import { env } from '../../app/config/env.js';
import { getAccessToken } from '../services/tokenClient.js';

const buildHubUrl = (hubPath) => {
  if (!hubPath) {
    return '';
  }

  if (/^https?:\/\//i.test(hubPath)) {
    return hubPath;
  }

  const explicitHubBase = env.signalRBaseUrl || '';
  const apiBase = env.apiBaseUrl || '';
  const baseUrl = explicitHubBase || apiBase.replace(/\/api(?:\/v\d+)?$/i, '');
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
