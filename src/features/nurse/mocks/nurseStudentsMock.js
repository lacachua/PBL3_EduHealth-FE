const HEALTH_PROFILE_MOCK_ENVELOPES = [
  {
    success: true,
    message: 'Mock health profile #1',
    data: {
      studentId: 'STD001',
      studentCode: 'HS001',
      fullName: 'Học sinh 1',
      classId: 'CLS001',
      className: '1/1',
      healthProfile: {
        heightCm: 121,
        weightKg: 22,
        bloodType: 'A',
        eyeStatus: 'Cận thị nhẹ',
        chronicNote: '',
        generalHealthNote: 'Cần theo dõi thị lực định kỳ',
        allergies: [
          {
            id: 'SA001',
            allergyTypeId: 'ALG001',
            allergyTypeName: 'Dị ứng hải sản',
            note: 'Nổi mề đay nhẹ',
          },
        ],
        updatedBy: {
          userId: 'USR002',
          fullName: 'Y tá trường',
        },
        updatedAt: '2026-04-04T08:30:00Z',
      },
    },
  },
  {
    success: true,
    message: 'Mock health profile #2',
    data: {
      studentId: 'STD002',
      studentCode: 'HS002',
      fullName: 'Học sinh 2',
      classId: 'CLS002',
      className: '2/2',
      healthProfile: {
        heightCm: 128,
        weightKg: 27,
        bloodType: 'O',
        eyeStatus: '',
        chronicNote: 'Hen phế quản nhẹ',
        generalHealthNote: '',
        allergies: [],
        updatedBy: {
          userId: 'USR002',
          fullName: 'Y tá trường',
        },
        updatedAt: '2026-04-04T08:30:00Z',
      },
    },
  },
  {
    success: true,
    message: 'Mock health profile #3',
    data: {
      studentId: 'STD003',
      studentCode: 'HS003',
      fullName: 'Học sinh 3',
      classId: 'CLS003',
      className: '4/1',
      healthProfile: {
        heightCm: 136,
        weightKg: 33,
        bloodType: 'B',
        eyeStatus: '',
        chronicNote: '',
        generalHealthNote: 'Cần bổ sung dinh dưỡng',
        allergies: [],
        updatedBy: {
          userId: 'USR002',
          fullName: 'Y tá trường',
        },
        updatedAt: '2026-04-04T08:30:00Z',
      },
    },
  },
  {
    success: true,
    message: 'Mock health profile #4',
    data: {
      studentId: 'STD004',
      studentCode: 'HS004',
      fullName: 'Học sinh 4',
      classId: 'CLS004',
      className: '5/3',
      healthProfile: {
        heightCm: 142,
        weightKg: 37,
        bloodType: 'AB',
        eyeStatus: '',
        chronicNote: '',
        generalHealthNote: '',
        allergies: [],
        updatedBy: {
          userId: 'USR002',
          fullName: 'Y tá trường',
        },
        updatedAt: '2026-04-04T08:30:00Z',
      },
    },
  },
];

export const NURSE_STUDENT_CLASS_FALLBACK_OPTIONS = [
  { value: 'all', label: 'Tất cả lớp' },
  { value: '1', label: '1/1' },
  { value: '2', label: '2/2' },
  { value: '3', label: '4/1' },
  { value: '4', label: '5/3' },
];

export const NURSE_STUDENT_CLASS_LABEL_MAP = {
  '1': '1/1',
  '2': '2/2',
  '3': '4/1',
  '4': '5/3',
  CLS001: '1/1',
  CLS002: '2/2',
  CLS003: '4/1',
  CLS004: '5/3',
  '1A': '1/1',
  '2B': '2/2',
  '4A': '4/1',
  '5C': '5/3',
};

export const getNurseStudentHealthProfileMockEnvelope = ({ row, index }) => {
  const seed = HEALTH_PROFILE_MOCK_ENVELOPES[index % HEALTH_PROFILE_MOCK_ENVELOPES.length];

  return {
    ...seed,
    data: {
      ...seed.data,
      studentId: row?.studentId || row?.id || seed.data.studentId,
      studentCode: row?.studentCode || seed.data.studentCode,
      fullName: row?.fullName || seed.data.fullName,
      classId: String(row?.classId || seed.data.classId),
      className: NURSE_STUDENT_CLASS_LABEL_MAP[row?.classId]
        || NURSE_STUDENT_CLASS_LABEL_MAP[row?.className]
        || seed.data.className,
      healthProfile: {
        ...seed.data.healthProfile,
        heightCm: row?.currentHeight ?? row?.heightCm ?? seed.data.healthProfile.heightCm,
        weightKg: row?.currentWeight ?? row?.weightKg ?? seed.data.healthProfile.weightKg,
      },
    },
  };
};