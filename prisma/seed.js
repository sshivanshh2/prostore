const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Classic T-Shirt',
        description: 'Soft cotton t-shirt for everyday wear',
        basePrice: 2500,
        category: 'Apparel',
      },
      {
        name: 'Running Sneakers',
        description: 'Lightweight sneakers designed for comfort',
        basePrice: 7500,
        category: 'Footwear',
      },
    ],
  })

  const products = await prisma.product.findMany()

  await prisma.productVariant.createMany({
    data: [
      {
        productId: products[0].id,
        name: 'Small',
        price: 2500,
      },
      {
        productId: products[0].id,
        name: 'Medium',
        price: 2600,
      },
      {
        productId: products[1].id,
        name: 'Size 9',
        price: 7500,
      },
      {
        productId: products[1].id,
        name: 'Size 10',
        price: 7600,
      },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })