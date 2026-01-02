'use client'
import { addToCart } from '@/app/actions/cart'

export default function AddToCartButton({ variantId }) {
    async function handleClick() {
    await addToCart(variantId)
  }

  return (
    <button onClick={handleClick}>
      Add to Cart
    </button>
  )
}