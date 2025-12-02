// web/src/app/(backend)/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { idSchema } from "@/app/(backend)/schemas/base.schema";
import {
  validBody,
  blockForbiddenRequests,
  returnInvalidDataErrors,
  zodErrorHandler,
} from "@/utils/api";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/app/(backend)/services/products";
import { updateProductSchema } from "@/app/(backend)/schemas/product.schema";
import type { Role } from "@/generated/prisma";

const allowedRoles: Record<string, Role[]> = {
  PATCH: ["ADMIN", "SUPER_ADMIN"] as Role[],
  DELETE: ["ADMIN", "SUPER_ADMIN"] as Role[],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ corrigido
) {
  try {
    const { id } = await params;
    const validation = idSchema.safeParse(id);
    if (!validation.success)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const product = await getProductById(id);
    if (!product)
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    return zodErrorHandler(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ corrigido
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.PATCH);
    if (forbidden) return forbidden;

    const { id } = await params;
    const body = await validBody(request);
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) return returnInvalidDataErrors(parsed.error);

    const updated = await updateProduct(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    return zodErrorHandler(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ corrigido
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.DELETE);
    if (forbidden) return forbidden;

    const { id } = await params;
    const deleted = await deleteProduct(id);
    return NextResponse.json(deleted);
  } catch (error) {
    return zodErrorHandler(error);
  }
}