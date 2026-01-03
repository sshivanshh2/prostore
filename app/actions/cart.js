'use server'

import { prisma } from '@/lib/db/prisma'

export async function addToCart(variantId) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  })

  if (!variant || variant.stock < 1) {
    throw new Error('Out of stock')
  }

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

export async function mergeCartToUser(userId) {
  const anonymousCart = await prisma.cart.findFirst({
    where: { userId: null },
    include: { items: true },
  })

  if (!anonymousCart) return

  const userCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  })

  // Case 1: User has no cart -> assign anonymous cart
  if (!userCart) {
    await prisma.cart.update({
      where: { id: anonymousCart.id },
      data: { userId },
    })
    return
  }

  // Case 2: Merge carts
  for (const item of anonymousCart.items) {
    const existingItem = userCart.items.find(
      (i) => i.variantId === item.variantId
    )

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + item.quantity,
        },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          variantId: item.variantId,
          quantity: item.quantity,
        },
      })
    }
  }

  // Cleanup anonymous cart
  await prisma.cart.delete({
    where: { id: anonymousCart.id },
  })
}