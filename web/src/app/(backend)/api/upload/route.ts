// web/src/app/(backend)/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/utils/s3';
import { blockForbiddenRequests } from '@/utils/api';
import type { Role } from '@/generated/prisma';

const allowedRoles = ['ADMIN', 'SUPER_ADMIN'] as Role[];

export async function POST(request: NextRequest) {
  try {
    const forbidden = await blockForbiddenRequests(request, allowedRoles);
    if (forbidden) return forbidden;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const url = await uploadToS3(buffer, file.name);

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}