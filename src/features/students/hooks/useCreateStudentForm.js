import { useCallback, useMemo, useState } from 'react';
import { normalizeApiMessage } from '../../../shared/api/normalizeResponse';
import { STUDENT_CREATE_INITIAL_VALUES } from '../constants/studentCreateOptions';
import { createStudentManagementApi } from '../services/studentManagementApi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cloneInitialValues = () => ({
  account: { ...STUDENT_CREATE_INITIAL_VALUES.account },
  profile: { ...STUDENT_CREATE_INITIAL_VALUES.profile },
  health: { ...STUDENT_CREATE_INITIAL_VALUES.health },
});

const getTodayDateOnly = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

const isDateBeforeToday = (value) => {
  if (!value) {
    return false;
  }

  const today = getTodayDateOnly();
  return value < today;
};

const buildFieldErrors = (values) => {
  const errors = {};

  if (!values.profile.studentCode.trim()) {
    errors['profile.studentCode'] = 'Vui lòng nhập mã học sinh.';
  }

  if (!values.profile.fullName.trim()) {
    errors['profile.fullName'] = 'Vui lòng nhập họ tên.';
  }

  if (!values.profile.dateOfBirth) {
    errors['profile.dateOfBirth'] = 'Vui lòng chọn ngày sinh.';
  } else if (!isDateBeforeToday(values.profile.dateOfBirth)) {
    errors['profile.dateOfBirth'] = 'Ngày sinh phải sớm hơn ngày hiện tại.';
  }

  if (!values.profile.gender) {
    errors['profile.gender'] = 'Vui lòng chọn giới tính.';
  }

  if (!values.profile.classId) {
    errors['profile.classId'] = 'Vui lòng chọn lớp.';
  }

  if (!values.account.password.trim()) {
    errors['account.password'] = 'Vui lòng nhập mật khẩu khởi tạo.';
  } else if (values.account.password.trim().length < 6) {
    errors['account.password'] = 'Mật khẩu tối thiểu 6 ký tự.';
  }

  if (!values.account.email.trim()) {
    errors['account.email'] = 'Vui lòng nhập email.';
  }

  if (!values.account.phoneNumber.trim()) {
    errors['account.phoneNumber'] = 'Vui lòng nhập số điện thoại.';
  }

  if (values.account.email.trim() && !EMAIL_REGEX.test(values.account.email.trim())) {
    errors['account.email'] = 'Định dạng email chưa hợp lệ.';
  }

  if (values.health.heightCm !== '' && Number(values.health.heightCm) <= 0) {
    errors['health.heightCm'] = 'Chiều cao phải lớn hơn 0.';
  }

  if (values.health.weightKg !== '' && Number(values.health.weightKg) <= 0) {
    errors['health.weightKg'] = 'Cân nặng phải lớn hơn 0.';
  }

  return errors;
};

const mapBackendFieldErrors = (errors = []) => {
  return errors.reduce((acc, item) => {
    if (item?.field && item?.message) {
      acc[item.field] = item.message;
    }
    return acc;
  }, {});
};

const buildPayload = (values) => ({
  classId: Number(values.profile.classId),
  fullName: values.profile.fullName.trim(),
  dateOfBirth: values.profile.dateOfBirth,
  currentHeight: values.health.heightCm === '' ? 0 : Number(values.health.heightCm),
  currentWeight: values.health.weightKg === '' ? 0 : Number(values.health.weightKg),
  medicalHistoryNotes: [
    values.health.eyeStatus?.trim() ? `Tình trạng mắt: ${values.health.eyeStatus.trim()}` : null,
    values.health.chronicNote?.trim() ? `Ghi chú bệnh mãn tính: ${values.health.chronicNote.trim()}` : null,
    values.health.allergies?.trim() ? `Dị ứng: ${values.health.allergies.trim()}` : null,
  ].filter(Boolean).join('\n') || null,
  phone: values.account.phoneNumber.trim(),
  email: values.account.email.trim(),
  gender: values.profile.gender,
  password: values.account.password.trim(),
});

const resolveCreatedStudentId = (envelope) => {
  const data = envelope?.data;
  return data?.studentId
    || data?.userId
    || data?.id
    || data?.student?.studentId
    || data?.student?.userId
    || data?.student?.id
    || data?.profile?.studentId
    || null;
};

export const useCreateStudentForm = () => {
  const [formValues, setFormValues] = useState(cloneInitialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasErrors = useMemo(() => Object.keys(fieldErrors).length > 0, [fieldErrors]);

  const updateField = (path, value) => {
    setFieldErrors((prev) => {
      if (!prev[path]) {
        return prev;
      }

      const next = { ...prev };
      delete next[path];
      return next;
    });

    setSubmitError('');

    setFormValues((prev) => {
      if (path.startsWith('account.')) {
        const key = path.replace('account.', '');
        return {
          ...prev,
          account: {
            ...prev.account,
            [key]: value,
          },
        };
      }

      if (path.startsWith('health.')) {
        const key = path.replace('health.', '');
        return {
          ...prev,
          health: {
            ...prev.health,
            [key]: value,
          },
        };
      }

      const key = path.replace('profile.', '');
      return {
        ...prev,
        profile: {
          ...prev.profile,
          [key]: value,
        },
      };
    });
  };

  const resetForm = useCallback(() => {
    setFormValues(cloneInitialValues());
    setFieldErrors({});
    setSubmitError('');
    setSubmitting(false);
  }, []);

  const submit = async () => {
    const nextErrors = buildFieldErrors(formValues);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return { success: false, data: null };
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = buildPayload(formValues);
      const envelope = await createStudentManagementApi(payload);
      const createdStudentId = resolveCreatedStudentId(envelope);
      const successMessage = createdStudentId
        ? 'Tạo học sinh thành công.'
        : 'Tạo học sinh thành công (không đọc được id trả về).';

      return {
        success: true,
        data: envelope?.data || null,
        message: envelope?.message || successMessage,
      };
    } catch (error) {
      const backendErrors = error?.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setFieldErrors((prev) => ({
          ...prev,
          ...mapBackendFieldErrors(backendErrors),
        }));
      }

      setSubmitError(normalizeApiMessage(error, 'Không thể tạo học sinh. Vui lòng thử lại.'));

      return {
        success: false,
        data: null,
      };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formValues,
    fieldErrors,
    hasErrors,
    submitError,
    submitting,
    updateField,
    resetForm,
    submit,
  };
};
