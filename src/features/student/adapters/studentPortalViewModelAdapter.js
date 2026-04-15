const fallbackText = 'Chưa cập nhật';

const toText = (value, fallback = fallbackText) => {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
};

const toDateLabel = (value) => {
  if (!value) {
    return fallbackText;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return toText(value);
  }

  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(date);
};

const toStableId = (value, prefix, index) => {
  const normalized = String(value ?? '').trim();
  if (normalized) {
    return normalized;
  }

  return `${prefix}-${index + 1}`;
};

const mapSummaryCards = (cards = []) => {
  return cards.slice(0, 4).map((item, index) => ({
    id: toStableId(item?.id, 'card', index),
    label: toText(item?.label),
    value: toText(item?.value),
    hint: toText(item?.hint, ''),
  }));
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapGrowthChart = (payload = {}) => {
  const points = Array.isArray(payload.points) ? payload.points : [];

  return {
    subtitle: toText(payload.subtitle, 'Theo dõi chiều cao và cân nặng theo từng tháng.'),
    points: points.slice(0, 6).map((item, index) => ({
      id: toStableId(item?.id, 'growth', index),
      label: toText(item?.label, `T${index + 1}`),
      heightCm: toNumber(item?.heightCm),
      weightKg: toNumber(item?.weightKg),
    })),
  };
};

const mapHealthHighlights = (highlights = []) => {
  return highlights.slice(0, 6).map((item, index) => ({
    id: toStableId(item?.id, 'health', index),
    label: toText(item?.label),
    value: toText(item?.value),
  }));
};

const mapReminders = (reminders = []) => {
  const normalizeReminderTone = (tone) => {
    const normalized = String(tone || '').trim().toLowerCase();

    if (normalized === 'amber' || normalized === 'mint' || normalized === 'sky') {
      return normalized;
    }

    return 'mint';
  };

  return reminders.slice(0, 4).map((item, index) => ({
    id: toStableId(item?.id, 'reminder', index),
    title: toText(item?.title),
    dateLabel: toText(item?.dateLabel),
    note: toText(item?.note),
    tone: normalizeReminderTone(item?.tone),
    icon: toText(item?.icon, 'notifications_active'),
  }));
};

const mapRecentActivities = (activities = []) => {
  const normalizeActivityTone = (tone, tag) => {
    const normalizedTone = String(tone || '').trim().toLowerCase();

    if (normalizedTone === 'mint' || normalizedTone === 'amber' || normalizedTone === 'sky') {
      return normalizedTone;
    }

    const normalizedTag = String(tag || '').toLowerCase();

    if (normalizedTag.includes('tiêm')) {
      return 'amber';
    }

    if (normalizedTag.includes('thông báo')) {
      return 'sky';
    }

    return 'mint';
  };

  return activities.slice(0, 6).map((item, index) => ({
    id: toStableId(item?.id, 'activity', index),
    title: toText(item?.title),
    description: toText(item?.description),
    timeLabel: toText(item?.timeLabel),
    tag: toText(item?.tag),
    icon: toText(item?.icon, 'task_alt'),
    tone: normalizeActivityTone(item?.tone, item?.tag),
  }));
};

export const mapOverviewToViewModel = (payload = {}) => {
  const student = payload.student || {};
  const account = payload.account || {};

  const fullName = toText(student.fullName || account.fullName, 'Học sinh');
  const avatar = toText(student.avatar || account.avatar, '');
  const className = toText(student.className || account.className, 'Chưa cập nhật');
  const studentCode = toText(student.studentCode || account.studentCode, 'Chưa cập nhật');

  return {
    hero: {
      fullName,
      className,
      studentCode,
      avatar,
      roleLabel: toText(account.roleLabel, 'Học sinh'),
      statusLabel: toText(account.statusLabel, 'Đang hoạt động'),
      email: toText(account.email, 'Chưa cập nhật'),
      isActive: Boolean(account.isActive ?? true),
    },
    summaryCards: mapSummaryCards(payload.summaryCards),
    growthChart: mapGrowthChart(payload.growthChart),
    healthHighlights: mapHealthHighlights(payload.healthHighlights),
    reminders: mapReminders(payload.reminders),
    recentActivities: mapRecentActivities(payload.recentActivities),
  };
};

const normalizeSearchText = (value) => {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const normalizeCareStatusTone = (label) => {
  const normalized = normalizeSearchText(label);

  if (normalized.includes('on dinh') || normalized.includes('ghi nhan')) {
    return 'success';
  }

  if (normalized.includes('theo doi') || normalized.includes('cap nhat')) {
    return 'info';
  }

  return 'muted';
};

export const mapCareHistoryToViewModel = (payload = {}) => {
  const student = payload.student || {};
  const records = Array.isArray(payload.records) ? [...payload.records] : [];

  const resolveStatusLabelFromCode = (code) => {
    const normalized = String(code || '').trim().toUpperCase();

    if (normalized === 'RECORDED') {
      return 'Đã ghi nhận';
    }

    if (normalized === 'STABILIZED') {
      return 'Đã ổn định';
    }

    if (normalized === 'UPDATED') {
      return 'Đã cập nhật';
    }

    return '';
  };

  const toTimestamp = (value) => {
    const date = new Date(value || '');
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  };

  records.sort((left, right) => {
    return toTimestamp(right?.visitDate || right?.dateLabel) - toTimestamp(left?.visitDate || left?.dateLabel);
  });

  const mapPrescriptions = (items = []) => {
    if (!Array.isArray(items)) {
      return [];
    }

    return items
      .slice(0, 5)
      .map((item, index) => ({
        id: toStableId(item?.id, 'rx', index),
        medicineName: toText(item?.medicineName || item?.name, ''),
        dosage: toText(item?.dosage, ''),
        instruction: toText(item?.instruction || item?.note, ''),
      }))
      .filter((item) => item.medicineName);
  };

  const timelineItems = records.map((item, index) => {
    const statusLabel = toText(item?.statusLabel || resolveStatusLabelFromCode(item?.status), 'Đã cập nhật');
    const prescriptions = mapPrescriptions(item?.prescriptions);

    return {
      id: toStableId(item?.id, 'care', index),
      visitId: toText(item?.visitId, ''),
      visitDate: toText(item?.visitDate, ''),
      dateLabel: toDateLabel(item?.visitDate || item?.dateLabel),
      title: toText(item?.title),
      summary: toText(item?.summary),
      category: toText(item?.category || item?.typeLabel || item?.detailType, 'Theo dõi'),
      typeLabel: toText(item?.category || item?.typeLabel || item?.detailType, 'Theo dõi'),
      detailType: toText(item?.detailType, ''),
      statusLabel,
      statusTone: normalizeCareStatusTone(statusLabel),
      statusCode: toText(item?.status, ''),
      nurseName: toText(item?.handledBy || item?.nurseName || item?.staffName, 'Chưa cập nhật'),
      staffName: toText(item?.handledBy || item?.nurseName || item?.staffName, 'Chưa cập nhật'),
      symptoms: toText(item?.symptoms, 'Chưa ghi nhận triệu chứng rõ ràng.'),
      diagnosis: toText(item?.diagnosis, 'Chưa ghi nhận bất thường.'),
      treatment: toText(item?.treatment || item?.treatmentSummary, 'Theo dõi thêm theo hướng dẫn.'),
      detailNote: toText(item?.note || item?.detailNote, 'Chưa cập nhật'),
      note: toText(item?.note || item?.detailNote, 'Chưa cập nhật'),
      advice: toText(item?.advice, ''),
      treatmentSummary: toText(item?.treatmentSummary || item?.treatment, ''),
      prescriptionsSummary: toText(
        item?.prescriptionsSummary || item?.prescriptionSummary,
        prescriptions.length ? `${prescriptions.length} mục hỗ trợ` : 'Không phát sinh đơn thuốc.',
      ),
      prescriptions,
    };
  });

  return {
    student: {
      fullName: toText(student.fullName, 'Học sinh'),
      className: toText(student.className, 'Chưa cập nhật'),
      studentCode: toText(student.studentCode, 'Chưa cập nhật'),
    },
    summary: {
      totalRecords: timelineItems.length,
      latestDate: timelineItems[0]?.dateLabel || fallbackText,
      latestTitle: timelineItems[0]?.title || fallbackText,
    },
    timelineItems,
  };
};

const normalizeVaccinationStatus = (statusCode, scheduledDate, vaccinatedAt) => {
  const normalized = String(statusCode || '').trim().toUpperCase();

  if (normalized === 'DONE' || vaccinatedAt) {
    return 'completed';
  }

  if (normalized === 'PENDING') {
    const scheduled = new Date(scheduledDate || '');
    if (Number.isNaN(scheduled.getTime())) {
      return 'pending';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return scheduled >= today ? 'upcoming' : 'pending';
  }

  return 'pending';
};

const toVaccinationStatusLabel = (status) => {
  if (status === 'completed') {
    return 'Đã tiêm';
  }

  if (status === 'upcoming') {
    return 'Sắp tới';
  }

  return 'Chờ cập nhật';
};

const toVaccinationTimestamp = (value) => {
  const date = new Date(value || '');
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

export const mapVaccinationsToViewModel = (payload = {}) => {
  const student = payload.student || {};
  const summary = payload.summary || {};
  const records = Array.isArray(payload.records) ? [...payload.records] : [];

  records.sort((left, right) => {
    return toVaccinationTimestamp(right?.scheduledDate) - toVaccinationTimestamp(left?.scheduledDate);
  });

  const mappedRecords = records.map((item, index) => {
    const doseNumber = Number(item?.doseNumber);
    const normalizedDose = Number.isFinite(doseNumber) && doseNumber > 0 ? doseNumber : null;
    const status = normalizeVaccinationStatus(item?.status, item?.scheduledDate, item?.vaccinatedAt);

    return {
      id: toStableId(item?.studentVaccinationId || item?.id, 'svac', index),
      studentVaccinationId: toText(item?.studentVaccinationId || item?.id, ''),
      campaignId: toText(item?.campaignId, ''),
      campaignName: toText(item?.campaignName, 'Đợt tiêm chưa đặt tên'),
      vaccineName: toText(item?.vaccineName),
      doseNumber: normalizedDose,
      doseLabel: normalizedDose ? `Mũi ${normalizedDose}` : 'Chưa rõ mũi',
      scheduledDate: toDateLabel(item?.scheduledDate),
      vaccinatedAt: item?.vaccinatedAt ? toDateLabel(item.vaccinatedAt) : 'Chưa tiêm',
      status,
      statusCode: toText(item?.status, ''),
      statusLabel: toVaccinationStatusLabel(status),
      lotNumber: toText(item?.lotNumber, ''),
      note: toText(item?.note, 'Không có ghi chú thêm.'),
    };
  });

  const computedCompleted = mappedRecords.filter((item) => item.status === 'completed').length;
  const computedUpcoming = mappedRecords.filter((item) => item.status === 'upcoming').length;
  const computedPending = mappedRecords.filter((item) => item.status === 'pending').length;

  const totalFromPayload = toNumber(summary.total);
  const completedFromPayload = toNumber(summary.completed);
  const upcomingFromPayload = toNumber(summary.upcoming);
  const pendingFromPayload = toNumber(summary.pendingUpdate ?? summary.pending);

  return {
    student: {
      fullName: toText(student.fullName, 'Học sinh'),
      className: toText(student.className, '--'),
      studentCode: toText(student.studentCode, '--'),
    },
    summary: {
      total: totalFromPayload ?? mappedRecords.length,
      completed: completedFromPayload ?? computedCompleted,
      upcoming: upcomingFromPayload ?? computedUpcoming,
      pending: pendingFromPayload ?? computedPending,
    },
    records: mappedRecords,
  };
};

export const mapAccountToViewModel = (payload = {}) => {
  const normalizedHeight = toNumber(payload.currentHeight);
  const normalizedWeight = toNumber(payload.currentWeight);

  return {
    profile: {
      fullName: toText(payload.fullName, 'Học sinh'),
      username: toText(payload.username, 'Chưa cập nhật'),
      email: toText(payload.email, 'Chưa cập nhật'),
      phone: toText(payload.phone, 'Chưa cập nhật'),
      roleLabel: toText(payload.roleLabel, 'Học sinh'),
      statusLabel: toText(payload.statusLabel, 'Đang hoạt động'),
      studentCode: toText(payload.studentCode, 'Chưa cập nhật'),
      className: toText(payload.className, 'Chưa cập nhật'),
      avatar: toText(payload.avatar, ''),
      isActive: Boolean(payload.isActive ?? true),
      gender: toText(payload.gender, 'Chưa cập nhật'),
      dateOfBirth: toDateLabel(payload.dateOfBirth),
      guardian: toText(payload.guardian || payload.guardianName, 'Chưa cập nhật'),
      guardianPhone: toText(payload.guardianPhone, 'Chưa cập nhật'),
      currentHeight: normalizedHeight !== null ? `${normalizedHeight} cm` : 'Chưa cập nhật',
      currentWeight: normalizedWeight !== null ? `${normalizedWeight} kg` : 'Chưa cập nhật',
      medicalHistoryNotes: toText(payload.medicalHistoryNotes, 'Chưa cập nhật'),
    },
    capabilities: {
      canUpdateProfile: Boolean(payload?.capabilities?.canUpdateProfile),
      canUploadAvatar: Boolean(payload?.capabilities?.canUploadAvatar),
      canChangePassword: Boolean(payload?.capabilities?.canChangePassword ?? true),
    },
  };
};
