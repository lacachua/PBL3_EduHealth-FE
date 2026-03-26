export const normalizeApiData = (response) => {
  const payload = response?.data;

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
};

export const normalizeApiMessage = (error, fallback = "Khong the ket noi may chu") => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};
