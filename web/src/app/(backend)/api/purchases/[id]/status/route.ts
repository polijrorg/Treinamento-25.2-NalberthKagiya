// web/src/app/(backend)/api/purchases/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { idSchema } from "@/app/(backend)/schemas/base.schema";
import {
  blockForbiddenRequests,
  returnInvalidDataErrors,
  zodErrorHandler,
} from "@/utils/api";
import { updatePurchaseStatus } from "@/app/(backend)/services/purchases";
import type { Role } from "@/generated/prisma";

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
});

const allowedRoles: Role[] = ["ADMIN", "SUPER_ADMIN"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles);
    if (forbidden) return forbidden;

    const { id } = await params;

    const idValidation = idSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const statusValidation = statusSchema.safeParse(body);
    if (!statusValidation.success) {
      return returnInvalidDataErrors(statusValidation.error);
    }

    const { status } = statusValidation.data;
    const updated = await updatePurchaseStatus(id, status);

    if (!updated) {
      return NextResponse.json({ error: "Compra não encontrada" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Erro na rota PATCH /status:", error);
    return NextResponse.json(
      { error: "Erro Interno do Servidor" },
      { status: 500 }
    );
  }
}