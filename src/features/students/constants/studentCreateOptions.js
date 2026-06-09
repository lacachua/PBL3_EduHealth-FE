export const STUDENT_CREATE_GENDER_OPTIONS = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

export const STUDENT_CREATE_INITIAL_VALUES = {
  account: {
    password: '',
    email: '',
    phoneNumber: '',
  },
  profile: {
    fullName: '',
    dateOfBirth: '',
    gender: 'MALE',
    classId: '',
  },
  health: {
    heightCm: '',
    weightKg: '',
    guardian: '',
    medicalHistoryNotes: '',
  },
};
