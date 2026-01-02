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
