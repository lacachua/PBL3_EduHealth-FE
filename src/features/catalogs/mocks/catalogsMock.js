const catalogMap = {
  vaccines: [
    {
      id: 'VAC-001',
      code: 'VAC-001',
      name: 'Sởi - Quai bị - Rubella (MMR)',
      description: 'Danh mục vắc xin phối hợp trong chương trình tiêm chủng học đường.',
      shortDescription: 'Vắc xin phối hợp phòng 3 bệnh phổ biến.',
      status: 'active',
      createdAt: '2026-01-10T08:00:00Z',
      updatedAt: '2026-03-28T08:30:00Z',
      metadata: { source: 'catalog-core' },
      group: 'vaccines',
    },
    {
      id: 'VAC-002',
      code: 'VAC-002',
      name: 'Viêm gan B',
      description: 'Danh mục dùng cho hồ sơ sức khỏe và theo dõi lịch tiêm.',
      shortDescription: 'Theo dõi trong hồ sơ tiêm chủng.',
      status: 'review',
      createdAt: '2026-01-12T08:00:00Z',
      updatedAt: '2026-03-21T10:00:00Z',
      metadata: { source: 'catalog-core' },
      group: 'vaccines',
    },
  ],
  diseases: [
    {
      id: 'DIS-001',
      code: 'DIS-001',
      name: 'Sốt xuất huyết',
      description: 'Danh mục bệnh lý tham chiếu trong hồ sơ học sinh.',
      shortDescription: 'Mã bệnh lý chuẩn hóa.',
      status: 'active',
      createdAt: '2026-01-05T08:00:00Z',
      updatedAt: '2026-03-22T08:30:00Z',
      metadata: { source: 'icd-reference' },
      group: 'diseases',
    },
    {
      id: 'DIS-002',
      code: 'DIS-002',
      name: 'Tay chân miệng',
      description: 'Danh mục bệnh lý cần đồng bộ liên kỳ.',
      shortDescription: 'Bản ghi theo dõi dịch tễ học đường.',
      status: 'pending_sync',
      createdAt: '2026-01-15T08:00:00Z',
      updatedAt: '2026-03-24T08:30:00Z',
      metadata: { source: 'icd-reference' },
      group: 'diseases',
    },
  ],
  allergies: [
    {
      id: 'ALL-001',
      code: 'ALL-001',
      name: 'Dị ứng hải sản',
      description: 'Danh mục dị ứng hỗ trợ cảnh báo trong khám bệnh học đường.',
      shortDescription: 'Cảnh báo dị ứng thường gặp.',
      status: 'active',
      createdAt: '2026-01-07T08:00:00Z',
      updatedAt: '2026-03-25T08:30:00Z',
      metadata: { source: 'allergy-reference' },
      group: 'allergies',
    },
    {
      id: 'ALL-002',
      code: 'ALL-002',
      name: 'Dị ứng đậu phộng',
      description: 'Bản ghi tạm ngưng sử dụng trong danh mục chuẩn.',
      shortDescription: 'Không dùng cho danh mục mới.',
      status: 'inactive',
      createdAt: '2026-01-09T08:00:00Z',
      updatedAt: '2026-03-19T08:30:00Z',
      metadata: { source: 'allergy-reference' },
      group: 'allergies',
    },
  ],
};

const applyFilters = (rows, query = {}) => {
  const keyword = (query.keyword || '').trim().toLowerCase();
  const status = query.status || 'all';

  return rows.filter((item) => {
    const byKeyword = !keyword
      || item.name.toLowerCase().includes(keyword)
      || item.code.toLowerCase().includes(keyword);
    const byStatus = status === 'all' || item.status === status;
    return byKeyword && byStatus;
  });
};

export const getCatalogListMockEnvelope = (query = {}) => {
  const group = query.group || 'vaccines';
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 10);

  const rows = applyFilters(catalogMap[group] || [], query);
  const start = (page - 1) * pageSize;
  const pagedRows = rows.slice(start, start + pageSize);

  return {
    success: true,
    message: 'Mock: tải danh sách danh mục thành công.',
    data: {
      group,
      items: pagedRows,
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

export const getCatalogDetailMockEnvelope = (catalogId, query = {}) => {
  const group = query.group;
  const sourceRows = group
    ? (catalogMap[group] || [])
    : Object.values(catalogMap).flat();

  const found = sourceRows.find((item) => item.id === catalogId || item.code === catalogId);

  if (!found) {
    return {
      success: false,
      message: 'Mock: không tìm thấy danh mục.',
      data: null,
      errors: [{ field: 'id', message: 'Catalog not found' }],
      meta: { source: 'mock' },
    };
  }

  return {
    success: true,
    message: 'Mock: tải chi tiết danh mục thành công.',
    data: found,
    errors: null,
    meta: { source: 'mock' },
  };
};
