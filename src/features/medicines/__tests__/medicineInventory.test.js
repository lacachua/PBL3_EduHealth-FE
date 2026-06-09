import { describe, expect, it } from 'vitest';
import {
  mockCreateMedicine,
  mockDisposeMedicine,
  mockGetMedicineById,
  mockGetMedicines,
  mockStockInMedicine,
} from '../mocks/medicineInventoryMockApi';

const futureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

describe('medicine inventory batches', () => {
  it('keeps one medicine row and manages batches in backend order', async () => {
    const initialList = await mockGetMedicines({ page: 1, pageSize: 2 });
    expect(initialList.data).toHaveLength(2);
    expect(initialList.meta.page).toBe(1);
    expect(initialList.meta.pageSize).toBe(2);
    expect(initialList.meta.totalItems).toBeGreaterThan(2);
    expect(initialList.meta.totalPages).toBe(Math.ceil(initialList.meta.totalItems / 2));
    expect(new Set(initialList.data.map((item) => item.id)).size).toBe(initialList.data.length);

    const withoutBatch = await mockCreateMedicine({
      name: 'Test medicine without batch',
      unit: 'VIEN',
      warningThreshold: 10,
    });
    expect(withoutBatch.data.currentStock).toBe(0);
    expect(withoutBatch.data.batches).toEqual([]);

    const created = await mockCreateMedicine({
      name: 'Test medicine with batches',
      unit: 'VIEN',
      warningThreshold: 10,
      initialQuantity: 30,
      expiryDate: futureDate(300),
      batchNumber: 'TEST-300',
    });
    const medicineId = created.data.id;

    await mockStockInMedicine(medicineId, {
      quantity: 20,
      expiryDate: futureDate(100),
      batchNumber: 'TEST-100',
    });
    await mockStockInMedicine(medicineId, {
      quantity: 40,
      expiryDate: futureDate(200),
      batchNumber: 'TEST-200',
    });

    let detail = await mockGetMedicineById(medicineId);
    expect(detail.data.currentStock).toBe(90);
    expect(detail.data.batches.map((batch) => batch.batchNumber)).toEqual([
      'TEST-100',
      'TEST-200',
      'TEST-300',
    ]);
    expect(detail.data.batches.filter((batch) => batch.isFefoPriority)).toHaveLength(1);

    const firstBatch = detail.data.batches[0];
    await mockDisposeMedicine(medicineId, {
      batchId: firstBatch.id,
      quantity: 5,
      reason: 'DAMAGED',
      note: 'Partial disposal',
    });

    detail = await mockGetMedicineById(medicineId);
    expect(detail.data.batches[0].remainingQuantity).toBe(15);
    expect(detail.data.batches[0].status).toBe('ACTIVE');

    await mockDisposeMedicine(medicineId, {
      batchId: firstBatch.id,
      quantity: 15,
      reason: 'DAMAGED',
      note: 'Full disposal',
    });

    detail = await mockGetMedicineById(medicineId);
    expect(detail.data.currentStock).toBe(70);
    expect(detail.data.batches[0].remainingQuantity).toBe(0);
    expect(detail.data.batches[0].status).toBe('DISPOSED');
    expect(detail.data.batches[0].isFefoPriority).toBe(false);
    expect(detail.data.batches[1].isFefoPriority).toBe(true);
  });
});
