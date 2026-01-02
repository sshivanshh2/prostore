'use server'

import { prisma } from '@/lib/db/prisma'

export async function addToCart(variantId) {
  // Find anonymous cart
  let cart = await prisma.cart.findFirst({
    where: {
      userId: null,
    },
  })

  // Create cart if none exists
  if (!cart) {
    cart = await prisma.cart.create({
      data: {},
    })
  }

  // Check if item already in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      variantId,
    },
  })

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 },
    })
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity: 1,
      },
    })
  }
}
