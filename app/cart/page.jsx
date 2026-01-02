import { prisma } from '@/lib/db/prisma'

async function getCart(){
    return prisma.cart.findFirst({
        where: {userId: null},
        include: {
            items: {
                include: {
                   variant:{
                        include: {
                            product:true
                        }
                   }     
                }
            }
        }
    })
}

export default async function CartPage() {
    const cart = await getCart()

    if(!cart || cart.items.length === 0){
        return <p>Your cart is empty.</p>
    }

    const subtotal = cart.items.reduce((sum, item)=>sum + item.variant.price*item.quantity, 0)


    return (
    <div>
      <h1>Your Cart</h1>

      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            <strong>{item.variant.product.name}</strong> –{' '}
            {item.variant.name} × {item.quantity}  
            (${(item.variant.price * item.quantity) / 100})
          </li>
        ))}
      </ul>

      <hr />
      <p>
        <strong>Subtotal:</strong> ${subtotal / 100}
      </p>
    </div>
  )
}