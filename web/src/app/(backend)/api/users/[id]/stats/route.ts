// web/src/app/(backend)/api/users/[id]/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { idSchema } from "@/app/(backend)/schemas/base.schema";
import { getUserStats } from "@/app/(backend)/services/purchases"; // ✅ Correto: vem de purchases
import { blockForbiddenRequests, zodErrorHandler } from "@/utils/api";
import type { Role } from "@/generated/prisma";

const allowedRoles: Record<string, Role[]> = {
  GET: ["USER", "ADMIN", "SUPER_ADMIN"] as Role[],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles.GET);
    if (forbidden) return forbidden;

    const { id } = await params;
    const validation = idSchema.safeParse(id);
    if (!validation.success)
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const stats = await getUserStats(id);
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    return zodErrorHandler(error);
  }
}