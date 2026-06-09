

export const CREATE_CAMPAIGN_INITIAL_VALUES = {
  name: '',
  vaccineName: '',
  doseNumber: '',
  scheduledDate: '',
  targetType: 'CLASS',
  targetClassIds: [],
  targetStudentIds: [],
  note: '',
};

export const UPDATE_STUDENT_VACCINATION_INITIAL_VALUES = {
  status: 'PENDING',
  vaccinatedAt: '',
  lotNumber: '',
  note: '',
};

const normalizeText = (value) => String(value || '').trim();

export const validateCreateCampaignValues = (values = {}) => {
  const errors = {};
  const targetType = String(values.targetType || 'CLASS').toUpperCase();

  if (!normalizeText(values.name)) {
    errors.name = 'Vui lòng nhập tên đợt tiêm.';
  }

  if (!normalizeText(values.vaccineName)) {
    errors.vaccineName = 'Vui lòng nhập tên vaccine.';
  }

  const doseNumber = Number(values.doseNumber);
  if (!Number.isFinite(doseNumber) || doseNumber <= 0) {
    errors.doseNumber = 'Số mũi phải lớn hơn 0.';
  }

  if (!values.scheduledDate) {
    errors.scheduledDate = 'Vui lòng chọn ngày thực hiện dự kiến.';
  } else {
    const today = new Date();
    const todayStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
    if (values.scheduledDate < todayStr) {
      errors.scheduledDate = 'Ngày tiêm dự kiến không được nhỏ hơn ngày hiện tại.';
    }
  }

  if (targetType !== 'CLASS' && targetType !== 'STUDENT') {
    errors.targetType = 'Hình thức áp dụng không hợp lệ.';
  }

  if (targetType === 'CLASS' && (!Array.isArray(values.targetClassIds) || !values.targetClassIds.length)) {
    errors.targetClassIds = 'Vui lòng chọn ít nhất một lớp.';
  }

  if (targetType === 'STUDENT' && (!Array.isArray(values.targetStudentIds) || !values.targetStudentIds.length)) {
    errors.targetStudentIds = 'Vui lòng chọn ít nhất một học sinh.';
  }

  return errors;
};

export const validateUpdateStudentVaccinationValues = (values = {}) => {
  const errors = {};
  const status = String(values.status || '').toUpperCase();

  if (!status) {
    errors.status = 'Vui lòng chọn trạng thái.';
    return errors;
  }

  if (status === 'DONE' && !values.vaccinatedAt) {
    errors.vaccinatedAt = 'Vui lòng chọn ngày tiêm thực tế.';
  }
  if (status === 'DONE' && values.vaccinatedAt) {
    const today = new Date();
    const todayStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');

    if (values.vaccinatedAt > todayStr) {
      errors.vaccinatedAt = 'Ng�y ti�m th?c t? kh�ng du?c l?n hon ng�y hi?n t?i.';
    }
  }
  if ((status === 'POSTPONED' || status === 'CONTRAINDICATED' || status === 'ABSENT') && !normalizeText(values.note)) {
    errors.note = 'Vui lòng nhập ghi chú cho trạng thái này.';
  }

  return errors;
};
