import { prisma } from '@/lib/db/prisma'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
  })

  return (
    <div>
      <h1>Products</h1>

      <ul>
        {products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong>
            <ul>
              {product.variants.map(variant => (
                <li key={variant.id}>
                  {variant.name} — ${variant.price}
                  <AddToCartButton variantId={variant.id} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
