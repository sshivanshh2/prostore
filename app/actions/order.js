import { prisma } from '@/lib/db/prisma'

export async function markOrderPaid(orderId, userId) {
    // verify ownership and status before updating
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  })

  // Authorization check
  if (!order || order.userId !== userId) {
    throw new Error('Unauthorized')
  }
  // Validate order state
  if (order.status !== 'PENDING') {
    throw new Error('Invalid order state')
  }

  //  Update the order status to PAID
  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID' },
  })
}

// Admin Actions (Ship, deliver or cancel)
export async function updateOrderStatus(orderId, status) {
  const allowed = ['SHIPPED', 'DELIVERED', 'CANCELLED']

  if (!allowed.includes(status)) {
    throw new Error('Invalid status')
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
}

export async function createOrder({ userId, cart }) {
  return prisma.$transaction(async (tx) => {
    for (const item of cart.items) {
      const updated = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      })

      if (updated.count === 0) {
        throw new Error('Insufficient stock')
      }
    }

    return tx.order.create({
      data: {
        userId,
        status: 'PAID',
        totalAmount: cart.totalAmount,
        items: {
          create: cart.items.map((item) => ({
            name: item.variant.name,
            price: item.variant.price,
            quantity: item.quantity,
          })),
        },
      },
    })
  })
}
