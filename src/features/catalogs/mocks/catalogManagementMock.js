const map = {
  vaccines: [
    { id: 'VAC-001', name: 'Sởi - Quai bị - Rubella (MMR)', status: 'active', updatedAt: '2026-03-28 08:30' },
    { id: 'VAC-002', name: 'Bạch hầu - Ho gà - Uốn ván (DPT)', status: 'active', updatedAt: '2026-03-26 10:45' },
    { id: 'VAC-003', name: 'Viêm gan B', status: 'review', updatedAt: '2026-03-24 16:20' },
  ],
  diseases: [
    { id: 'DIS-001', name: 'Sốt xuất huyết', status: 'active', updatedAt: '2026-03-27 09:15' },
    { id: 'DIS-002', name: 'Thủy đậu', status: 'active', updatedAt: '2026-03-22 13:11' },
    { id: 'DIS-003', name: 'Tay chân miệng', status: 'review', updatedAt: '2026-03-21 10:03' },
  ],
  allergies: [
    { id: 'ALL-001', name: 'Dị ứng hải sản', status: 'active', updatedAt: '2026-03-25 09:30' },
    { id: 'ALL-002', name: 'Dị ứng sữa', status: 'review', updatedAt: '2026-03-24 15:20' },
    { id: 'ALL-003', name: 'Dị ứng đậu phộng', status: 'active', updatedAt: '2026-03-23 14:18' },
  ],
};

const apply = (rows, query) => {
  const keyword = (query.keyword || '').trim().toLowerCase();
  const status = query.status || 'all';

  return rows.filter((row) => {
    const byKeyword = !keyword || row.id.toLowerCase().includes(keyword) || row.name.toLowerCase().includes(keyword);
    const byStatus = status === 'all' || row.status === status;
    return byKeyword && byStatus;
  });
};

export const getCatalogManagementMockEnvelope = (query = {}) => {
  const group = query.group || 'vaccines';
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);
  const rows = apply(map[group] || [], query);

  return {
    success: true,
    message: 'Tải dữ liệu danh mục thành công',
    data: {
      group,
      items: rows.slice((page - 1) * pageSize, page * pageSize),
    },
    errors: null,
    meta: {
      page,
      pageSize,
      totalItems: rows.length,
      totalPages: Math.max(1, Math.ceil(rows.length / pageSize)),
      source: 'mock',
    },
  };
};
