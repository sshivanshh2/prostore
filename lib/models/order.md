# Order

Represents a completed checkout.

Core fields:
- id
- userId
- status (pending | paid | shipped | delivered | cancelled)
- totalAmount
- createdAt

Relationships:
- has many OrderItems

Notes:
- Immutable once paid
- Source of truth for purchase history
