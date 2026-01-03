import { prisma } from '@/lib/db/prisma'

export async function getUserOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      items: {
        select: {
          name: true,
          price: true,
          quantity: true,
        },
      },
    },
  })
}

export async function getUserOrdersPaginated(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit

  return prisma.order.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
    },
  })
}