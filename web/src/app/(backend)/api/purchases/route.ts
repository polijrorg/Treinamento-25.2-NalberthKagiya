import { NextRequest, NextResponse } from "next/server";
import { createPurchaseSchema } from "@/app/(backend)/schemas/purchase.schema";
import {
  validBody,
  blockForbiddenRequests,
  returnInvalidDataErrors,
  getUserFromRequest
} from "@/utils/api";

import {
  createPurchase,
  getAllPurchases
} from "@/app/(backend)/services/purchases";

const roles = { GET: ["ADMIN", "SUPER_ADMIN"], POST: ["USER", "ADMIN", "SUPER_ADMIN"] };

export async function GET(request: NextRequest) {
  const forbidden = await blockForbiddenRequests(request, roles.GET);
  if (forbidden) return forbidden;

  const list = await getAllPurchases();
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  const forbidden = await blockForbiddenRequests(request, roles.POST);
  if (forbidden) return forbidden;

  const user = await getUserFromRequest(request);
  const body = await validBody(request);

  const parsed = createPurchaseSchema.safeParse(body);
  if (!parsed.success) return returnInvalidDataErrors(parsed.error);

  const purchase = await createPurchase(parsed.data.productIds, user?.id);
  return NextResponse.json(purchase, { status: 201 });
}