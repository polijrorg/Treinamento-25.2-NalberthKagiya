// web/src/app/(backend)/services/categories/index.ts
import prisma from "@/app/(backend)/services/db";

export async function createCategory(data: { name: string }) {
  return prisma.category.create({ data });
}

export async function getAllCategories() {
  return prisma.category.findMany();
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function updateCategory(id: string, data: Partial<any>) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}