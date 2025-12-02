import { NextRequest, NextResponse } from "next/server";
import { createProductSchema } from "@/app/(backend)/schemas/product.schema";
import { validBody, blockForbiddenRequests, returnInvalidDataErrors } from "@/utils/api";
import { createProduct, getAllProducts } from "@/app/(backend)/services/products";

const roles = { POST: ["ADMIN", "SUPER_ADMIN"] };

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const forbidden = await blockForbiddenRequests(request, roles.POST);
  if (forbidden) return forbidden;

  const body = await validBody(request);
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) return returnInvalidDataErrors(parsed.error);

  const product = await createProduct(parsed.data);
  return NextResponse.json(product, { status: 201 });
}