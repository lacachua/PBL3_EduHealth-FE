export const STUDENT_CREATE_GENDER_OPTIONS = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

export const STUDENT_CREATE_CLASS_OPTIONS = [
  { value: 'CLS001', label: '4A' },
  { value: 'CLS002', label: '4B' },
  { value: 'CLS003', label: '5A' },
];

export const STUDENT_CREATE_INITIAL_VALUES = {
  account: {
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
  },
  profile: {
    studentCode: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'MALE',
    classId: '',
  },
  health: {
    heightCm: '',
    weightKg: '',
    eyeStatus: '',
    chronicNote: '',
    allergies: '',
  },
};
