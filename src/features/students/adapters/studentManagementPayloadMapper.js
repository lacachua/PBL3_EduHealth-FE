const clean = (value) => (typeof value === 'string' ? value.trim() : value);

export const normalizeStudentListQuery = (query = {}) => {
  const params = {
    page: Number(query.page || 1),
    pageSize: Number(query.pageSize || 10),
  };

  const keyword = clean(query.keyword || '');
  if (keyword) params.search = keyword;

  const classId = clean(query.classId || 'all');
  if (classId && classId !== 'all') {
    const parsed = Number(classId);
    if (Number.isFinite(parsed)) {
      params.classId = parsed;
    }
  }

  const status = clean(query.status || 'all');
  if (status === 'ACTIVE') params.isActive = true;
  if (status === 'INACTIVE') params.isActive = false;

  return params;
};

export const buildStudentBasicPatchPayload = (values = {}) => ({
  fullName: values.fullName?.trim() || '',
  dateOfBirth: values.dateOfBirth || null,
  gender: values.gender || null,
  classId: values.classId ? Number(values.classId) : null,
  email: values.email?.trim() || '',
  ...(values.phoneNumber?.trim() ? { phone: values.phoneNumber.trim() } : { phone: null }),
});

export const buildStudentHealthPatchPayload = (values = {}) => ({
  ...(values.heightCm === '' || values.heightCm === null || values.heightCm === undefined ? { currentHeight: null } : { currentHeight: Number(values.heightCm) }),
  ...(values.weightKg === '' || values.weightKg === null || values.weightKg === undefined ? { currentWeight: null } : { currentWeight: Number(values.weightKg) }),
  medicalHistoryNotes: [
    values.eyeStatus?.trim() ? `Tình trạng mắt: ${values.eyeStatus.trim()}` : null,
    values.chronicNote?.trim() ? `Ghi chú bệnh mãn tính: ${values.chronicNote.trim()}` : null,
    values.allergies?.trim() ? `Dị ứng: ${values.allergies.trim()}` : null,
  ].filter(Boolean).join('\n') || null,
});
