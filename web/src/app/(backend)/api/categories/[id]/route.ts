// web/src/app/(backend)/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { idSchema } from "@/app/(backend)/schemas/base.schema";
import {
  validBody,
  blockForbiddenRequests,
  returnInvalidDataErrors,
  zodErrorHandler,
} from "@/utils/api";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/app/(backend)/services/categories";
import { updateCategorySchema } from "@/app/(backend)/schemas/category.schema";
import type { Role } from "@/generated/prisma";

const allowedRoles: Record<string, Role[]> = {
  PATCH: ["ADMIN", "SUPER_ADMIN"] as Role[],
  DELETE: ["ADMIN", "SUPER_ADMIN"] as Role[],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validation = idSchema.safeParse(id);
    if (!validation.success)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const cat = await getCategoryById(id);
    if (!cat)
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });

    return NextResponse.json(cat);
  } catch (error) {
    return zodErrorHandler(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.PATCH);
    if (forbidden) return forbidden;

    const { id } = await params;
    const body = await validBody(request);
    const validationResult = updateCategorySchema.safeParse(body);
    if (!validationResult.success)
      return returnInvalidDataErrors(validationResult.error);

    const updated = await updateCategory(id, validationResult.data);
    return NextResponse.json(updated);
  } catch (error) {
    return zodErrorHandler(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.DELETE);
    if (forbidden) return forbidden;

    const { id } = await params;
    const deleted = await deleteCategory(id);
    return NextResponse.json(deleted);
  } catch (error) {
    return zodErrorHandler(error);
  }
}