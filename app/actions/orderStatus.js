import { prisma } from '@/lib/db/prisma'
import { canTransition } from '@/lib/orders/statusMachine'

export async function updateOrderStatus({ orderId, nextStatus }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })

  if (!order) throw new Error('Order not found')

  if (!canTransition(order.status, nextStatus)) {
    throw new Error(`Invalid transition ${order.status} → ${nextStatus}`)
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: nextStatus },
  })
}
