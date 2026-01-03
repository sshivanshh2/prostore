export const ORDER_TRANSITIONS = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'REFUNDED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
}

export function canTransition(from, to) {
  return ORDER_TRANSITIONS[from]?.includes(to)
}