// web/src/app/(backend)/services/products/index.ts
import prisma from "@/app/(backend)/services/db";

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryIds?: string[];
}) {
  return prisma.product.create({ data });
}

export async function getAllProducts() {
  return prisma.product.findMany();
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}