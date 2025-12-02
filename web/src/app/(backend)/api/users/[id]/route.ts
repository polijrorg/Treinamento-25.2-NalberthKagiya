// web/src/app/(backend)/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { blockForbiddenRequests, getUserFromRequest, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils/api";
import { AllowedRoutes } from "@/types";
import { idSchema, patchSchema } from "@/backend/schemas";
import { deleteUser, findUserById, updateUser } from "@/backend/services/users";
import { toErrorMessage } from "@/utils/api/toErrorMessage";

const allowedRoles: AllowedRoutes = {
  PATCH: ["SUPER_ADMIN", "ADMIN", "USER"],
  DELETE: ["SUPER_ADMIN", "ADMIN", "USER"],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validationResult = idSchema.safeParse(id);
    if (!validationResult.success) {
      return NextResponse.json(toErrorMessage("ID inválido"), { status: 400 });
    }

    const user = await findUserById(id);
    if (!user) {
      return NextResponse.json(toErrorMessage("Usuário não encontrado"), { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof NextResponse) return error;
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

    const userFromRequest = await getUserFromRequest(request);
    if (userFromRequest instanceof NextResponse) return userFromRequest;

    const { id } = await params;
    const idValidationResult = idSchema.safeParse(id);
    if (!idValidationResult.success) {
      return NextResponse.json(toErrorMessage("ID inválido"), { status: 400 });
    }

    // Só permite usuário comum atualizar a si mesmo
    if (userFromRequest.role === "USER" && id !== userFromRequest.id) {
      return NextResponse.json({ success: false, message: "Acesso negado" }, { status: 403 });
    }

    const body = await validBody(request);
    const validationResult = patchSchema.safeParse(body);
    if (!validationResult.success) {
      return returnInvalidDataErrors(validationResult.error);
    }

    const updatedUser = await updateUser(id, validationResult.data);
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof NextResponse) return error;
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

    const userFromRequest = await getUserFromRequest(request);
    if (userFromRequest instanceof NextResponse) return userFromRequest;

    const { id } = await params;
    const validationResult = idSchema.safeParse(id);
    if (!validationResult.success) {
      return NextResponse.json(toErrorMessage("ID inválido"), { status: 400 });
    }

    if (userFromRequest.role === "USER" && id !== userFromRequest.id) {
      return NextResponse.json({ success: false, message: "Acesso negado" }, { status: 403 });
    }

    const deletedUser = await deleteUser(id);
    return NextResponse.json(deletedUser);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return zodErrorHandler(error);
  }
}