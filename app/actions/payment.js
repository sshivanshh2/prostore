import { updateOrderStatus } from './orderStatus'

export async function confirmPayment(orderId) {
  // later: Stripe webhook
  return updateOrderStatus({
    orderId,
    nextStatus: 'PAID',
  })
}