# Cart

Represents a user's active shopping cart.

Core fields:
- id
- userId (nullable for guest carts)

Relationships:
- has many CartItems

Behavior:
- persists across sessions
- merges on login

Notes:
- Guest carts live in localStorage
- Authenticated carts sync to backend
