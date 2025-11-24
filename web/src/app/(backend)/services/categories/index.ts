import prisma from "@/app/(backend)/services/db";

export async function createCategory(data) {
  return prisma.category.create({ data });
}

export function getAllCategories() {
  return prisma.category.findMany();
}

export function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export function updateCategory(id: string, data: any) {
  return prisma.category.update({ where: { id }, data });
}

export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}