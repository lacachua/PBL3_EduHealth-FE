const defaultSupplementary = {
  vaccinations: [],
  emergencyContacts: [],
  growthIndicators: {
    weightForAgePercent: 0,
    heightForAgePercent: 0,
    note: 'Du lieu tham chieu dang duoc cap nhat tu he thong y te hoc duong.',
  },
};

const supplementaryByKey = {
  '1': {
    vaccinations: [
      { id: 'VAC-1', vaccineName: 'Cum mua', administeredAt: '2025-10-12', location: 'Tram y te phuong', status: 'DONE' },
      { id: 'VAC-2', vaccineName: 'Soi - Quai bi - Rubella', administeredAt: '2024-05-20', location: 'Truong tieu hoc', status: 'DONE' },
    ],
    emergencyContacts: [
      { id: 'EC-1', relation: 'Me', fullName: 'Nguyen Thi Lan', phone: '0901234567', primary: true },
      { id: 'EC-2', relation: 'Bo', fullName: 'Nguyen Van Binh', phone: '0912345678', primary: false },
    ],
    growthIndicators: {
      weightForAgePercent: 91,
      heightForAgePercent: 88,
      note: 'Nam trong nguong phat trien binh thuong cua lua tuoi',
    },
  },
  '2': {
    vaccinations: [
      { id: 'VAC-3', vaccineName: 'Bach hau - Ho ga - Uon van', administeredAt: '2025-03-16', location: 'Benh vien Quan', status: 'DONE' },
    ],
    emergencyContacts: [
      { id: 'EC-3', relation: 'Me', fullName: 'Pham Thi Hoa', phone: '0913123456', primary: true },
    ],
    growthIndicators: {
      weightForAgePercent: 87,
      heightForAgePercent: 90,
      note: 'Chi so tang truong on dinh',
    },
  },
  '3': {
    vaccinations: [],
    emergencyContacts: [
      { id: 'EC-4', relation: 'Me', fullName: 'Tran Thi Mai', phone: '0977567890', primary: true },
      { id: 'EC-5', relation: 'Bo', fullName: 'Tran Quoc Khanh', phone: '0988111111', primary: false },
    ],
    growthIndicators: {
      weightForAgePercent: 84,
      heightForAgePercent: 86,
      note: 'Can theo doi bo sung dinh duong trong hoc ky toi',
    },
  },
  '4': {
    vaccinations: [
      { id: 'VAC-4', vaccineName: 'COVID-19 mui nhac lai', administeredAt: '2025-09-10', location: 'Truong tieu hoc', status: 'DONE' },
    ],
    emergencyContacts: [
      { id: 'EC-6', relation: 'Me', fullName: 'Le Thi Huong', phone: '0987000111', primary: true },
    ],
    growthIndicators: {
      weightForAgePercent: 89,
      heightForAgePercent: 91,
      note: 'Tang truong deu, phu hop lua tuoi',
    },
  },
};

const keyAliases = {
  STD001: '1',
  STD002: '2',
  STD003: '3',
  STD004: '4',
  HS00124: '1',
  HS00156: '2',
  HS00212: '3',
  HS00245: '4',
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const resolveSupplementaryKey = (studentId) => {
  if (studentId === null || studentId === undefined || studentId === '') {
    return '1';
  }

  const normalized = String(studentId).trim();
  if (!normalized) {
    return '1';
  }

  if (keyAliases[normalized]) {
    return keyAliases[normalized];
  }

  if (supplementaryByKey[normalized]) {
    return normalized;
  }

  const parsed = Number(normalized);
  if (Number.isFinite(parsed) && parsed > 0) {
    const safe = ((parsed - 1) % Object.keys(supplementaryByKey).length) + 1;
    return String(safe);
  }

  return '1';
};

export const getNurseHealthProfileSupplementaryMock = (studentId) => {
  const key = resolveSupplementaryKey(studentId);
  const source = supplementaryByKey[key] || defaultSupplementary;
  return clone(source);
};
