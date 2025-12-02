// web/src/app/(backend)/api/purchases/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { idSchema } from "@/app/(backend)/schemas/base.schema";
import { blockForbiddenRequests, zodErrorHandler } from "@/utils/api";
import {
  getPurchaseById,
  deletePurchase,
} from "@/app/(backend)/services/purchases";
import type { Role } from "@/generated/prisma";

const allowedRoles = {
  DELETE: ["ADMIN", "SUPER_ADMIN"] as Role[],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!idSchema.safeParse(id).success)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const purchase = await getPurchaseById(id);
    if (!purchase)
      return NextResponse.json({ error: "Não encontrada" }, { status: 404 });

    return NextResponse.json(purchase);
  } catch (error) {
    return zodErrorHandler(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await blockForbiddenRequests(request, allowedRoles.DELETE);
  if (forbidden) return forbidden;

  const { id } = await params;
  const deleted = await deletePurchase(id);

  return NextResponse.json(deleted);
}