const HTTP_ERROR_MESSAGES = {
  400: "Yeu cau khong hop le.",
  401: "Phien dang nhap da het han. Vui long dang nhap lai.",
  403: "Ban khong co quyen thuc hien thao tac nay.",
  404: "Khong tim thay du lieu yeu cau.",
  409: "Du lieu dang xung dot. Vui long kiem tra lai.",
  422: "Du lieu chua hop le. Vui long kiem tra lai thong tin.",
  500: "He thong dang ban. Vui long thu lai sau.",
};

const extractPayload = (responseOrPayload) => {
  if (!responseOrPayload || typeof responseOrPayload !== "object") {
    return null;
  }

  // Guard against double-extraction if the object is already an API Envelope
  if ("data" in responseOrPayload && !("success" in responseOrPayload && "meta" in responseOrPayload)) {
    return responseOrPayload.data;
  }

  return responseOrPayload;
};

export const normalizeApiEnvelope = (responseOrPayload) => {
  const payload = extractPayload(responseOrPayload);

  if (!payload || typeof payload !== "object") {
    return {
      success: null,
      message: "",
      data: payload,
      errors: null,
      meta: null,
    };
  }

  const hasEnvelopeKeys = ["success", "message", "data", "errors", "meta"].some(
    (key) => key in payload
  );

  if (!hasEnvelopeKeys) {
    return {
      success: null,
      message: "",
      data: payload,
      errors: null,
      meta: null,
    };
  }

  return {
    success: payload.success ?? null,
    message: payload.message || "",
    data: "data" in payload ? payload.data : null,
    errors: payload.errors || null,
    meta: payload.meta || null,
  };
};

export const normalizeApiData = (responseOrPayload) => {
  const envelope = normalizeApiEnvelope(responseOrPayload);
  return envelope.data;
};

export const normalizeApiMessage = (error, fallback = "Khong the ket noi may chu") => {
  const status = error?.response?.status;
  const envelope = normalizeApiEnvelope(error?.response);
  const firstErrorMessage = Array.isArray(envelope.errors) ? envelope.errors[0]?.message : null;
  const problemDetails = error?.response?.data;

  const firstProblemError = (() => {
    const entries = Object.entries(problemDetails?.errors || {});
    if (!entries.length) {
      return null;
    }
    const [, messages] = entries[0];
    return Array.isArray(messages) ? messages[0] : null;
  })();

  if (!error?.response) {
    return fallback;
  }

  return (
    envelope.message ||
    firstErrorMessage ||
    problemDetails?.title ||
    firstProblemError ||
    problemDetails?.detail ||
    error?.response?.data?.message ||
    HTTP_ERROR_MESSAGES[status] ||
    error?.message ||
    fallback
  );
};

export const mapApiFieldErrors = (error) => {
  const envelope = normalizeApiEnvelope(error?.response);
  const errors = Array.isArray(envelope.errors) ? envelope.errors : [];
  const mapped = {};

  errors.forEach((item) => {
    if (!item || typeof item !== 'object') {
      return;
    }

    const field = (item.field || item.path || '').toString().trim();
    const message = (item.message || '').toString().trim();

    if (field && message) {
      mapped[field] = message;
    }
  });

  if (Object.keys(mapped).length) {
    return mapped;
  }

  const problemErrors = error?.response?.data?.errors;
  if (problemErrors && typeof problemErrors === 'object') {
    Object.entries(problemErrors).forEach(([field, messages]) => {
      const firstMessage = Array.isArray(messages) ? messages[0] : messages;
      if (!firstMessage) {
        return;
      }

      mapped[field] = String(firstMessage);
      if (field.length > 1) {
        const camelField = `${field[0].toLowerCase()}${field.slice(1)}`;
        if (!mapped[camelField]) {
          mapped[camelField] = String(firstMessage);
        }
      }
    });
  }

  if (Object.keys(mapped).length) {
    return mapped;
  }

  const fallbackField = error?.response?.data?.field;
  const fallbackMessage = error?.response?.data?.message;
  if (fallbackField && fallbackMessage) {
    return { [fallbackField]: fallbackMessage };
  }

  return {};
};

export const isNetworkError = (error) => !error?.response;
