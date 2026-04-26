import { env } from '../../../../app/config/env';
import { getAccessToken } from '../../../../shared/services/tokenClient';
import { emitNotificationsChanged } from './notificationsEvents';

/**
 * Đề xuất kết nối SSE (Server-Sent Events) cho Notifications
 * API endpoint: GET /api/v1/notifications/stream
 *
 * Vì EventSource chuẩn của trình duyệt không hỗ trợ header Authorization (Bearer token),
 * chúng ta có 2 cách tiếp cận:
 * 1. (Được dùng dưới đây): Sử dụng fetch() để stream response thay vì EventSource.
 * 2. Cập nhật backend (Program.cs) để hỗ trợ đọc token từ QueryString (?access_token=...), sau đó dùng EventSource chuẩn.
 * 3. Sử dụng polyfill như @microsoft/fetch-event-source.
 */
export const connectNotificationSse = () => {
  const token = getAccessToken();
  if (!token) return null;

  const abortController = new AbortController();

  const connect = async () => {
    try {
      const response = await fetch(`${env.apiBaseUrl}/api/v1/notifications/stream`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream'
        },
        signal: abortController.signal
      });

      if (!response.ok || !response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        // Khi có event mới (không phải heartbeat)
        if (text.includes('data:')) {
          // Gửi event để hook useNotificationInbox/useNotificationsBellPanel tải lại dữ liệu
          emitNotificationsChanged();
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('SSE connection error:', e);
        // Thêm logic retry ở đây nếu cần (setTimeout -> connect())
      }
    }
  };

  connect();

  return () => {
    abortController.abort();
  };
};
