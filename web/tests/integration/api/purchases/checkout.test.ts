// web/tests/integration/api/purchases/checkout.test.ts
import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/(backend)/api/purchases/route';
import * as purchaseService from '@/app/(backend)/services/purchases';
import { validBody } from '@/utils/api';

vi.mock('@/app/(backend)/services/purchases', () => ({
  createPurchase: vi.fn().mockResolvedValue({
    id: 'p1',
    priceTotal: 100,
    productIds: ['prod1'],
    userIds: ['user1'],
  }),
}));

vi.mock('@/utils/api', async () => {
  const actual = await vi.importActual('@/utils/api');
  return {
    ...actual,
    validBody: vi.fn().mockResolvedValue({ productIds: ['prod1'] }),
    getUserFromRequest: vi.fn().mockResolvedValue({ id: 'user1' }),
    blockForbiddenRequests: vi.fn().mockResolvedValue(null),
  };
});

describe('POST /api/purchases (checkout)', () => {
  it('cria compra com sucesso', async () => {
    const mockRequest = {} as Request;
    const response = await POST(mockRequest as any);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBeDefined();
  });
});