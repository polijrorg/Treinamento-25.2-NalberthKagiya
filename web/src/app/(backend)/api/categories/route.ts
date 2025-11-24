import { NextRequest, NextResponse } from "next/server";
import { createCategorySchema } from "@/app/(backend)/schemas/category.schema";
import { validBody, blockForbiddenRequests, returnInvalidDataErrors } from "@/utils/api";
import { createCategory, getAllCategories } from "@/app/(backend)/services/categories";

const roles = { POST: ["ADMIN", "SUPER_ADMIN"] };

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const forbidden = await blockForbiddenRequests(request, roles.POST);
  if (forbidden) return forbidden;

  const body = await validBody(request);
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) return returnInvalidDataErrors(parsed.error);

  const category = await createCategory(parsed.data);
  return NextResponse.json(category, { status: 201 });
}