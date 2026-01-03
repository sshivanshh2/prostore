import { prisma } from '@/lib/db/prisma'

export async function createReview({ productId, userId, rating, comment }) {
  return prisma.review.create({
    data: {
      productId,
      userId,
      rating,
      comment,
    },
  })
}

export async function getProductReviews(productId) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    select: {
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function getAverageRating(productId) {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  })

  return {
    average: result._avg.rating || 0,
    count: result._count,
  }
}