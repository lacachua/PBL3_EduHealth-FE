const toPositiveInteger = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized || normalized === 'undefined' || normalized === 'null') {
      return null;
    }

    const parsedFromString = Number(normalized);
    if (Number.isInteger(parsedFromString) && parsedFromString > 0) {
      return parsedFromString;
    }

    // Mock datasets can use coded identifiers such as STU-1001 or USR001.
    // Extract trailing numeric segment so route id remains a positive integer.
    const trailingDigits = normalized.match(/(\d+)$/);
    if (trailingDigits?.[1]) {
      const parsedFromCode = Number(trailingDigits[1]);
      if (Number.isInteger(parsedFromCode) && parsedFromCode > 0) {
        return parsedFromCode;
      }
    }

    return null;
  }

  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }

  return null;
};

export const resolveNurseStudentRouteId = (...candidates) => {
  for (const candidate of candidates) {
    const resolved = toPositiveInteger(candidate);
    if (resolved) {
      return resolved;
    }
  }

  return null;
};

export const resolveNurseStudentRouteIdFromRow = (row) => {
  if (!row || typeof row !== 'object') {
    return null;
  }

  return resolveNurseStudentRouteId(
    row.apiId,
    row.studentId,
    row.userId,
    row.id,
    row.studentCode,
    row.code
  );
};
