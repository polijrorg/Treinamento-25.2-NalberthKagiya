import { NextResponse } from "next/server";
import { idSchema } from "@/app/(backend)/schemas/base.schema";
import { getUserStats } from "@/app/(backend)/services/purchases";

export async function GET(req: Request, { params }: any) {
  const { id } = await params;

  if (!idSchema.safeParse(id).success)
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const stats = await getUserStats(id);
  return NextResponse.json(stats);
}