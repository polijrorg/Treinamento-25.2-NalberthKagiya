// web/src/app/(backend)/api/purchases/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { idSchema } from '@/app/(backend)/schemas/base.schema';
import {
  blockForbiddenRequests,
  returnInvalidDataErrors,
  zodErrorHandler,
} from '@/utils/api';
import { updatePurchaseStatus } from '@/app/(backend)/services/purchases';
import { sendEmail } from '@/utils/email';
import OrderStatusEmail from '@/templates/OrderStatusEmail';
import { findUserById } from '@/app/(backend)/services/users';
import { render } from '@react-email/render';
import type { Role } from '@/generated/prisma';

const statusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
});

const allowedRoles: Record<string, Role[]> = {
  PATCH: ['ADMIN', 'SUPER_ADMIN'] as Role[],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.PATCH);
    if (forbidden) return forbidden;

    const { id } = await params;

    // ✅ Validação do ID (faltava na main)
    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const body = await request.json();
    const statusValidation = statusSchema.safeParse(body);
    if (!statusValidation.success) {
      return returnInvalidDataErrors(statusValidation.error);
    }

    const { status } = statusValidation.data;
    const updated = await updatePurchaseStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Compra não encontrada' }, { status: 404 });
    }

    // 📩 Enviar e-mail apenas para statuses válidos
    if (['paid', 'shipped', 'delivered'].includes(status)) {
      const userId = updated.userIds[0];
      if (userId) {
        const user = await findUserById(userId);
        if (user?.email && user.name) {
          const validStatus = status as 'paid' | 'shipped' | 'delivered';
          const html = await render(
            OrderStatusEmail({ name: user.name, status: validStatus })
          );
          await sendEmail({
            to: user.email,
            subject: 'Atualização do seu pedido - Clash Cards',
            body: html,
          });
        }
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro na rota PATCH /status:', error);
    return zodErrorHandler(error);
  }
}