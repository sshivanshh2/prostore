# Server vs Client Boundary

- Code that touches databases, secrets, or Stripe MUST live on the server
- UI and interaction logic live in client components
- Domain logic should be framework-agnostic whenever possible

Violating this boundary causes security and performance issues.
