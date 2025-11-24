import prisma from "@/app/(backend)/services/db";

export async function createProduct(data) {
  return prisma.product.create({ data });
}

export function getAllProducts() {
  return prisma.product.findMany();
}

export function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export function updateProduct(id: string, data: any) {
  return prisma.product.update({ where: { id }, data });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}