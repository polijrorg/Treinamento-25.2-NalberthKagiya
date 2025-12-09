// web/tests/integration/api/products/create.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/(backend)/api/products/route';
import * as productService from '@/app/(backend)/services/products';
import { validBody } from '@/utils/api';

vi.mock('@/app/(backend)/services/products', () => ({
  createProduct: vi.fn(),
}));

vi.mock('@/utils/api', async () => {
  const actual = await vi.importActual('@/utils/api');
  return {
    ...actual,
    validBody: vi.fn().mockResolvedValue({
      name: 'Dragão Infernal',
      description: 'Dano crescente contra tanques',
      price: 129.9,
    }),
    blockForbiddenRequests: vi.fn().mockResolvedValue(null),
  };
});

describe('POST /api/products', () => {
  beforeEach(() => vi.clearAllMocks());

  it('cria produto com sucesso (ADMIN)', async () => {
    (productService.createProduct as any).mockResolvedValue({
      id: 'bcd43116-ee06-4748-afaa-c16f3b39869b',
      name: 'Dragão Infernal',
      description: 'Dano crescente contra tanques',
      price: 129.9,
    });

    const mockRequest = {} as Request;
    const response = await POST(mockRequest as any);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.name).toBe('Dragão Infernal');
  });
});