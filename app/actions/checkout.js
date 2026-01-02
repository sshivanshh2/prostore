import { prisma } from '@/lib/db/prisma'

export async function checkout(userId){
    return await prisma.$transaction(async(tx)=>{
        // Fetch the user's cart with all items + their variants
        const cart = await tx.cart.findUnique({
            where: {userId},
            include: {
                items: {
                    include:{
                        variant: true,
                    },
                },
            },
        })
        
        // abort the transaction, if no cart
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty')
        }

        let totalAmount = 0

        // We create the order first so we have an order.id to attach items to.
        const order = tx.order.create({
            data:{
                userId,
                status: 'PENDING',
                totalAmount: 0
            }
        })

        // Loop through cart items and create order items
        for (const item of cart.items) {
            const price = item.variant.price
            const subtotal = price * item.quantity

            // Add to running total
            totalAmount += subtotal

             // Create an orderItem for each cart item
            await tx.orderItem.create({
                data: {
                orderId: order.id,       
                name: item.variant.name, 
                price,                   
                quantity: item.quantity,
                },
            })
        }
        
        // Update the order with the final total amount
        await tx.order.update({
            where: { id: order.id },
            data: { totalAmount },
        })

        // Delete all cart items (not the cart itself)
        await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
        })

        return order
    })
}