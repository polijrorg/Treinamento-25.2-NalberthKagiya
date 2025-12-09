// web/tests/integration/api/products/getAll.test.ts
import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/(backend)/api/products/route';
import * as productService from '@/app/(backend)/services/products';

vi.mock('@/app/(backend)/services/products', () => ({
  getAllProducts: vi.fn().mockResolvedValue([
    { id: '1', name: 'Dragão', price: 100 },
  ]),
}));

describe('GET /api/products', () => {
  it('lista todos os produtos', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
  });
});