import { NextRequest, NextResponse } from "next/server";
import { idSchema } from "@/app/(backend)/schemas/base.schema";
import { validBody, blockForbiddenRequests, returnInvalidDataErrors } from "@/utils/api";

import {
  getProductById,
  updateProduct,
  deleteProduct
} from "@/app/(backend)/services/products";

import { updateProductSchema } from "@/app/(backend)/schemas/product.schema";

const roles = { PATCH: ["ADMIN", "SUPER_ADMIN"], DELETE: ["SUPER_ADMIN"] };

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!idSchema.safeParse(id).success)
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const product = await getProductById(id);
  if (!product)
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json(product);
}

export async function PATCH(request: NextRequest, { params }: any) {
  const forbidden = await blockForbiddenRequests(request, roles.PATCH);
  if (forbidden) return forbidden;

  const { id } = await params;
  const body = await validBody(request);

  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) return returnInvalidDataErrors(parsed.error);

  const updated = await updateProduct(id, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: any) {
  const forbidden = await blockForbiddenRequests(request, roles.DELETE);
  if (forbidden) return forbidden;

  const { id } = await params;
  const deleted = await deleteProduct(id);
  return NextResponse.json(deleted);
}