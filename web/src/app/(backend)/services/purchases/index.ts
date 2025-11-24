import prisma from "@/app/(backend)/services/db";
import type { PurchaseStatus } from "@/generated/prisma";

/**
 * Cria uma compra nova.
 * productIds → lista de produtos
 * userId → usuário que fez a compra (opcional)
 */
export async function createPurchase(productIds: string[], userId?: string) {
  // Buscar produtos
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (!products.length) {
    throw new Error("Nenhum produto encontrado para os IDs fornecidos.");
  }

  const priceTotal = products.reduce((acc, p) => acc + p.price, 0);

  return prisma.purchase.create({
    data: {
      priceTotal,
      productIds,
      userIds: userId ? [userId] : [],
    },
  });
}

/**
 * Buscar todas as compras
 */
export function getAllPurchases() {
  return prisma.purchase.findMany({
    include: {
      products: true,
      users: true,
    },
  });
}

/**
 * Buscar compra por ID
 */
export function getPurchaseById(id: string) {
  return prisma.purchase.findUnique({
    where: { id },
    include: {
      products: true,
      users: true,
    },
  });
}

/**
 * Deletar compra
 */
export function deletePurchase(id: string) {
  return prisma.purchase.delete({
    where: { id },
  });
}

/**
 * Atualizar status da compra
 */
export function updatePurchaseStatus(id: string, status: PurchaseStatus) {
  return prisma.purchase.update({
    where: { id },
    data: { status },
  });
}

/**
 * Estatísticas de usuário (total gasto, nº compras, produto mais comprado)
 */
export async function getUserStats(userId: string) {
  const purchases = await prisma.purchase.findMany({
    where: { userIds: { has: userId } },
  });

  if (!purchases.length) {
    return {
      totalSpent: 0,
      totalPurchases: 0,
      mostBoughtProduct: null,
    };
  }

  const totalSpent = purchases.reduce((s, p) => s + p.priceTotal, 0);
  const totalPurchases = purchases.length;

  // Contar produtos
  const count: Record<string, number> = {};

  for (const purchase of purchases) {
    for (const productId of purchase.productIds) {
      count[productId] = (count[productId] || 0) + 1;
    }
  }

  // Descobrir o mais comprado
  let bestProductId: string | null = null;
  let max = 0;

  for (const [productId, qty] of Object.entries(count)) {
    if (qty > max) {
      max = qty;
      bestProductId = productId;
    }
  }

  const mostBoughtProduct = bestProductId
    ? await prisma.product.findUnique({ where: { id: bestProductId } })
    : null;

  return {
    totalSpent,
    totalPurchases,
    mostBoughtProduct,
  };
}