export const STUDENT_CREATE_GENDER_OPTIONS = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

export const STUDENT_CREATE_CLASS_OPTIONS = [
  { value: '1', label: '4A' },
  { value: '2', label: '4B' },
  { value: '3', label: '5A' },
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
