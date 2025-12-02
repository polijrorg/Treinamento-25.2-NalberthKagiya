import { NextRequest, NextResponse } from "next/server";
import { idSchema } from "@/app/(backend)/schemas/base.schema";
import {
  blockForbiddenRequests,
  zodErrorHandler,
} from "@/utils/api";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/app/(backend)/services/categories";
import { updateCategorySchema } from "@/app/(backend)/schemas/category.schema";
import type { Role } from "@/generated/prisma"; // ← Importa o tipo Role

// ✅ Tipagem explícita como Role[]
const allowedRoles: Record<string, Role[]> = {
  PATCH: ["ADMIN", "SUPER_ADMIN"] as Role[],
  DELETE: ["ADMIN", "SUPER_ADMIN"] as Role[],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const category = await getCategoryById(id);
    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }
    return NextResponse.json(category);
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
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const parse = updateCategorySchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: "Dados inválidos", details: parse.error.issues }, { status: 400 });
    }

    const updated = await updateCategory(id, parse.data);
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
    const validation = idSchema.safeParse(id);
    if (!validation.success) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const deleted = await deleteCategory(id);
    return NextResponse.json(deleted);
  } catch (error) {
    return zodErrorHandler(error);
  }
}