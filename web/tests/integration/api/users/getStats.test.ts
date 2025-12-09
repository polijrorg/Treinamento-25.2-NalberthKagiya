// web/tests/integration/api/users/getStats.test.ts
import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server'; // ✅ Importação corrigida
import { GET } from '@/app/(backend)/api/users/[id]/stats/route';
import * as statsService from '@/app/(backend)/services/purchases';

vi.mock('@/app/(backend)/services/purchases', () => ({
  getUserStats: vi.fn().mockResolvedValue({
    totalSpent: 100,
    totalPurchases: 1,
    mostBoughtProduct: { id: 'prod1', name: 'Dragão' },
  }),
}));

vi.mock('@/utils/api', async () => {
  const actual = await vi.importActual('@/utils/api');
  return {
    ...actual,
    blockForbiddenRequests: vi.fn().mockResolvedValue(null),
  };
});

describe('GET /api/users/:id/stats', () => {
  it('retorna estatísticas do usuário', async () => {
    const params = Promise.resolve({ id: 'user1' });
    // ✅ Mock compatível com NextRequest
    const request = {
      headers: new Headers(),
      cookies: {} as any,
      nextUrl: {} as any,
    } as NextRequest;
    const response = await GET(request, { params });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.totalSpent).toBe(100);
  });
});